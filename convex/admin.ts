import { query } from "./_generated/server";

export const countProperties = query({
    handler: async (ctx) => {
        const property = await ctx.db
            .query("property")
            .collect()

        const availableProperty = property.filter(p => p.status === "available")
        const reservedProperty = property.filter(p => p.status === "reserved")
        const soldProperty = property.filter(p => p.status === "sold")

        return {
            property: property.length,
            available: availableProperty.length,
            reserved: reservedProperty.length,
            soldProperty: soldProperty.length,
        }
    }
})

export const countTransactions = query({
    handler: async (ctx) => {
        const transactions = await ctx.db
            .query("deal")
            .collect()

        const pendingTransactions = transactions.filter(t => t.status === "pending_approval")
        const negotiatingTransactions = transactions.filter(t => t.status === "negotiating")
        const activeTransactions = transactions.filter(t => t.status === "active")
        const approvedTransactions = transactions.filter(t => t.status === "approved")
        const cancelledTransactions = transactions.filter(t => t.status === "cancelled")
        const rejectedTransactions = transactions.filter(t => t.status === "rejected")
        const completedTransactions = transactions.filter(t => t.status === "completed")

        return {
            transactions: transactions.length,
            pending: pendingTransactions.length,
            negotiating: negotiatingTransactions.length,
            active: activeTransactions.length,
            approved: approvedTransactions.length,
            cancelled: cancelledTransactions.length,
            rejected: rejectedTransactions.length,
            completed: completedTransactions.length,
        }
    }
})

export const soldPropertiesByMonth = query({
    handler: async (ctx) => {
        const properties = await ctx.db
            .query("property")
            .filter(q => q.eq(q.field("status"), "sold"))
            .collect()

        const monthCounts: Record<string, number> = {};
        properties.forEach((p) => {
            const date = new Date(p.createdAt);
            const month = date.toLocaleString("default", { month: "long" });
            monthCounts[month] = (monthCounts[month] || 0) + 1;
        });

        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return months.map(month => ({
            month,
            sold: monthCounts[month] || 0
        }));
    }
})

// DAR-02: Hotspot Analysis of Housing Supply
export const getHotspotAnalysis = query({
    handler: async (ctx) => {
        const properties = await ctx.db.query("property").collect();
        const deals = await ctx.db.query("deal").collect();

        // Group properties by city
        const cityAnalysis = properties.reduce((acc, prop) => {
            const city = prop.city;
            if (!acc[city]) {
                acc[city] = {
                    city,
                    totalListings: 0,
                    availableListings: 0,
                    soldListings: 0,
                    reservedListings: 0,
                    totalValue: 0,
                    avgPrice: 0,
                    popularity: 0, // Based on saved properties and deals
                };
            }

            acc[city].totalListings++;
            if (prop.status === "available") acc[city].availableListings++;
            if (prop.status === "sold") acc[city].soldListings++;
            if (prop.status === "reserved") acc[city].reservedListings++;
            acc[city].totalValue += prop.totalSellingPrice;

            return acc;
        }, {} as Record<string, any>);

        // Calculate popularity based on deals
        deals.forEach((deal) => {
            const property = properties.find(p => p._id === deal.propertyId);
            if (property && cityAnalysis[property.city]) {
                cityAnalysis[property.city].popularity++;
            }
        });

        // Calculate averages
        Object.values(cityAnalysis).forEach((city: any) => {
            city.avgPrice = city.totalListings > 0
                ? Math.round(city.totalValue / city.totalListings)
                : 0;
            city.supplyDemandRatio = city.availableListings > 0
                ? (city.popularity / city.availableListings).toFixed(2)
                : 0;
        });

        return Object.values(cityAnalysis).sort((a: any, b: any) => b.popularity - a.popularity);
    }
})

// DAR-03: Regional Market Analysis
export const getRegionalMarketAnalysis = query({
    handler: async (ctx) => {
        const properties = await ctx.db.query("property").collect();
        const deals = await ctx.db.query("deal").collect();

        const regionalData = properties.reduce((acc, prop) => {
            const city = prop.city;
            if (!acc[city]) {
                acc[city] = {
                    city,
                    // Supply metrics
                    totalSupply: 0,
                    availableSupply: 0,
                    // Price metrics
                    minPrice: Infinity,
                    maxPrice: 0,
                    avgPrice: 0,
                    totalValue: 0,
                    // Property type distribution
                    propertyTypes: {} as Record<string, number>,
                    // Transaction metrics
                    totalDeals: 0,
                    activeDeals: 0,
                    completedDeals: 0,
                    avgDealValue: 0,
                    totalDealValue: 0,
                    // Market health indicators
                    absorptionRate: 0, // sold / total supply
                    inventoryMonths: 0, // available / (sold per month)
                };
            }

            // Supply metrics
            acc[city].totalSupply++;
            if (prop.status === "available") acc[city].availableSupply++;

            // Price metrics
            acc[city].totalValue += prop.totalSellingPrice;
            acc[city].minPrice = Math.min(acc[city].minPrice, prop.totalSellingPrice);
            acc[city].maxPrice = Math.max(acc[city].maxPrice, prop.totalSellingPrice);

            // Property types
            const unitType = prop.unitType || "Other";
            acc[city].propertyTypes[unitType] = (acc[city].propertyTypes[unitType] || 0) + 1;

            // Absorption rate calculation
            if (prop.status === "sold") {
                acc[city].absorptionRate++;
            }

            return acc;
        }, {} as Record<string, any>);

        // Add deal metrics
        deals.forEach((deal) => {
            const property = properties.find(p => p._id === deal.propertyId);
            if (property && regionalData[property.city]) {
                regionalData[property.city].totalDeals++;
                if (deal.status === "active") regionalData[property.city].activeDeals++;
                if (deal.status === "completed") {
                    regionalData[property.city].completedDeals++;
                    if (deal.finalDealPrice) {
                        regionalData[property.city].totalDealValue += deal.finalDealPrice;
                    }
                }
            }
        });

        // Calculate final metrics
        Object.values(regionalData).forEach((region: any) => {
            // Average price
            region.avgPrice = region.totalSupply > 0
                ? Math.round(region.totalValue / region.totalSupply)
                : 0;

            // Average deal value
            region.avgDealValue = region.completedDeals > 0
                ? Math.round(region.totalDealValue / region.completedDeals)
                : 0;

            // Absorption rate (percentage)
            region.absorptionRate = region.totalSupply > 0
                ? ((region.absorptionRate / region.totalSupply) * 100).toFixed(1)
                : "0.0";

            // Inventory months (simplified - assumes 1 month data)
            region.inventoryMonths = region.absorptionRate > 0
                ? (region.availableSupply / (region.absorptionRate / 100 * region.totalSupply)).toFixed(1)
                : "N/A";

            // Convert property types to array for easier visualization
            region.propertyTypesArray = Object.entries(region.propertyTypes).map(([type, count]) => ({
                type,
                count,
                percentage: ((count as number / region.totalSupply) * 100).toFixed(1)
            })).sort((a, b) => (b.count as number) - (a.count as number));
        });

        return Object.values(regionalData);
    }
})

// DAR-05: Data Export - Get all properties for export
export const getAllPropertiesForExport = query({
    handler: async (ctx) => {
        const properties = await ctx.db.query("property").collect();
        const users = await ctx.db.query("users").collect();

        return properties.map(prop => {
            const seller = users.find(u => u._id === prop.sellerId);
            return {
                id: prop._id,
                propertyName: prop.propertyName,
                city: prop.city,
                address: prop.address,
                status: prop.status,
                unitType: prop.unitType,
                bedrooms: prop.bedrooms || 0,
                bathrooms: prop.bathrooms || 0,
                lotArea: prop.lotArea,
                pricePerSqm: prop.pricePerSqm,
                totalSellingPrice: prop.totalSellingPrice,
                netContractPrice: prop.netContractPrice,
                featured: prop.featured ? "Yes" : "No",
                sellerName: seller ? `${seller.fname} ${seller.lname}` : "Unknown",
                sellerEmail: seller?.email || "N/A",
                createdAt: new Date(prop.createdAt).toLocaleDateString(),
                updatedAt: new Date(prop.updatedAt).toLocaleDateString(),
            };
        });
    }
})

// DAR-05: Data Export - Get all transactions for export
export const getAllTransactionsForExport = query({
    handler: async (ctx) => {
        const deals = await ctx.db.query("deal").collect();
        const properties = await ctx.db.query("property").collect();
        const users = await ctx.db.query("users").collect();

        return deals.map(deal => {
            const property = properties.find(p => p._id === deal.propertyId);
            const buyer = users.find(u => u._id === deal.buyerId);
            const seller = users.find(u => u._id === deal.sellerId);

            return {
                id: deal._id,
                propertyName: property?.propertyName || "Unknown",
                propertyCity: property?.city || "N/A",
                propertyAddress: property?.address || "N/A",
                buyerName: buyer ? `${buyer.fname} ${buyer.lname}` : "Unknown",
                buyerEmail: buyer?.email || "N/A",
                sellerName: seller ? `${seller.fname} ${seller.lname}` : "Unknown",
                sellerEmail: seller?.email || "N/A",
                status: deal.status,
                offerPrice: deal.proposal.offer,
                finalDealPrice: deal.finalDealPrice || 0,
                downPayment: deal.downPayment || 0,
                monthlyAmortization: deal.agreedMonthlyAmortization || 0,
                termInMonths: deal.agreedTermInMonths || 0,
                requestDate: new Date(deal.requestDate).toLocaleDateString(),
                approvalDate: deal.approvalDate ? new Date(deal.approvalDate).toLocaleDateString() : "N/A",
                remarks: deal.remarks || "N/A",
            };
        });
    }
})

// DAR-05: Data Export - Get all users for export
export const getAllUsersForExport = query({
    handler: async (ctx) => {
        const users = await ctx.db.query("users").collect();

        return users.map(user => ({
            id: user._id,
            firstName: user.fname,
            lastName: user.lname,
            email: user.email,
            contact: user.contact,
            role: user.role,
            address: `${user.houseNumber} ${user.street}, ${user.barangay}, ${user.city}`,
            phoneVerified: user.phoneVerified ? "Yes" : "No",
            agency: user.agentInfo?.agency || "N/A",
            experience: user.agentInfo?.experience ? `${user.agentInfo.experience} years` : "N/A",
            licenseNumber: user.agentInfo?.licenseNumber || "N/A",
        }));
    }
})