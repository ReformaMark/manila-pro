import { Id } from "./_generated/dataModel";
import { mutation } from "./_generated/server";

export const createRealisticPropertyData = mutation({
    handler: async (ctx) => {
        const testSellerId = "kh7d4m2kawrayq1xkp36yrz5h17pykp1" as Id<"users">;

        const realisticProperties = [];

        // FIXED: Helper function with improved pricing logic
        const createProperty = (
            index: number,
            city: "Makati" | "Taguig" | "Pasay",
            basePrice: number,
            pricePerSqmBase: number
        ) => {
            const unitTypes = [
                "apartment",
                "condominium",
                "duplex",
                "single attached house",
                "single detached house",
                "townhouse/detached row house"
            ];

            // More controlled distribution for better ML training
            const lotArea = 45 + (index % 25) * 4; // 45-145 sqm (more reasonable range)
            const bedrooms = Math.min(1 + Math.floor(index / 10), 4); // 1-4 bedrooms gradually
            const bathrooms = Math.min(1 + Math.floor(bedrooms / 2), 3); // Logical bathroom count based on bedrooms
            const storeys = Math.min(1 + Math.floor(bedrooms / 3), 2); // 1-2 storeys mostly (realistic)
            const unitType = unitTypes[index % unitTypes.length];

            // 🔧 IMPROVED PRICING LOGIC - Multiplicative instead of additive
            const basePricePerSqm = pricePerSqmBase + (index * 300); // Gradual increase per property
            let totalPrice = lotArea * basePricePerSqm; // Start with realistic area-based pricing

            // Unit type adjustments (multiplicative factors, not additive premiums)
            const unitMultipliers = {
                "apartment": 0.88,           // Cheapest
                "condominium": 1.00,         // Base reference
                "duplex": 1.08,              // Slight premium
                "single attached house": 0.95, // Slightly below condo
                "single detached house": 1.20, // Premium for detached
                "townhouse/detached row house": 1.05 // Small premium
            };

            totalPrice *= unitMultipliers[unitType as keyof typeof unitMultipliers];

            // Bedroom adjustments (realistic incremental pricing)
            if (bedrooms > 2) {
                totalPrice *= (1 + (bedrooms - 2) * 0.08); // 8% per extra bedroom above 2
            }

            // Bathroom adjustments (smaller impact than bedrooms)
            if (bathrooms > 1) {
                totalPrice *= (1 + (bathrooms - 1) * 0.04); // 4% per extra bathroom above 1
            }

            // Storey adjustment (reasonable premium for multi-storey)
            if (storeys > 1) {
                totalPrice *= 1.06; // 6% for multi-storey
            }

            // Add realistic market variance (±8%) - deterministic but varied
            const variance = 0.92 + (Math.sin(index * 2.34 + city.length) * 0.16);
            totalPrice *= variance;

            // Round to realistic increments (nearest 50k for cleaner pricing)
            totalPrice = Math.round(totalPrice / 50000) * 50000;

            // City-based price boundaries to ensure realism
            const cityConstraints = {
                "Makati": { min: 4000000, max: 20000000 },    // ₱4M - ₱20M
                "Taguig": { min: 3000000, max: 15000000 },    // ₱3M - ₱15M  
                "Pasay": { min: 2500000, max: 12000000 }      // ₱2.5M - ₱12M
            };

            // Enforce realistic price boundaries
            totalPrice = Math.max(totalPrice, cityConstraints[city].min);
            totalPrice = Math.min(totalPrice, cityConstraints[city].max);

            // More controlled amenities/facilities for consistent ML training
            const amenitiesCount = 3 + (index % 5); // 3-7 amenities (more consistent range)
            const facilitiesCount = 2 + (index % 4); // 2-5 facilities (more consistent range)

            return {
                propertyName: `${city} ${unitType} ${index + 1}`,
                sellerId: testSellerId,
                city: city,
                unitType: unitType,
                lotArea: lotArea,
                bedrooms: bedrooms,
                bathrooms: bathrooms,
                storeys: storeys.toString(),
                totalSellingPrice: totalPrice,
                pricePerSqm: Math.round(totalPrice / lotArea),
                totalContractPrice: totalPrice,
                netContractPrice: Math.round(totalPrice * 0.95),
                suggestedMonthlyAmortization: Math.round(totalPrice / 180),
                suggestedTermInMonths: 180,
                block: String.fromCharCode(65 + (index % 26)), // A-Z
                lot: (index + 1).toString(),
                displayImage: "kg29me75nxyynqzaaxfxd7ysvh7cpbsp",
                otherImage: ["kg29me75nxyynqzaaxfxd7ysvh7cpbsp"],
                address: `${index + 1} ${city} Street, ${city} City`,
                coordinates: [
                    14.5 + (Math.random() - 0.5) * 0.1,
                    121.0 + (Math.random() - 0.5) * 0.1
                ],
                featured: index % 12 === 0, // ~8% featured (more realistic)
                propertyType: "pre owned",
                maximumOccupants: (bedrooms * 2).toString(),
                transactionType: "Buy",
                status: "available" as const,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                description: `${bedrooms}BR ${bathrooms}BA ${unitType} in ${city} - ${lotArea}sqm`,
                amenities: Array.from({ length: amenitiesCount }, (_, i) => ({
                    name: [
                        "Swimming Pool", "Gym", "Security", "Parking", "Garden",
                        "Playground", "Function Hall", "Basketball Court", "Jogging Path",
                        "24/7 CCTV", "Clubhouse", "Tennis Court"
                    ][i % 12],
                    description: `Quality amenity facility`
                })),
                facilities: Array.from({ length: facilitiesCount }, (_, i) => ({
                    name: [
                        "School District", "Hospital", "Shopping Mall", "Transport Hub",
                        "Business District", "Parks", "Restaurant Area"
                    ][i % 7],
                    description: `Accessible facility nearby`
                }))
            };
        };

        // FIXED: More balanced distribution with conservative pricing
        // 40 Makati (Premium but realistic)
        for (let i = 0; i < 40; i++) {
            realisticProperties.push(
                createProperty(i, "Makati", 4000000, 70000) // Reduced base price per sqm
            );
        }

        // 35 Taguig (Mid-range)
        for (let i = 0; i < 35; i++) {
            realisticProperties.push(
                createProperty(i, "Taguig", 3500000, 55000) // More conservative
            );
        }

        // 25 Pasay (Budget-friendly)
        for (let i = 0; i < 25; i++) {
            realisticProperties.push(
                createProperty(i, "Pasay", 3000000, 45000) // Realistic budget pricing
            );
        }

        // Insert all properties with better error handling
        let inserted = 0;
        let failed = 0;

        console.log(`🏗️ Starting to insert ${realisticProperties.length} realistic properties...`);

        for (const prop of realisticProperties) {
            try {
                await ctx.db.insert("property", prop);
                inserted++;

                // Log progress every 20 inserts
                if (inserted % 20 === 0) {
                    console.log(`✅ Inserted ${inserted}/${realisticProperties.length} properties`);
                }
            } catch (error) {
                failed++;
                console.error(`❌ Failed to insert property ${prop.propertyName}:`, error);
            }
        }

        console.log(`🎉 Completed: ${inserted} successful, ${failed} failed`);

        return {
            success: true,
            message: `Successfully created ${inserted} realistic properties (${failed} failed)`,
            summary: {
                totalGenerated: realisticProperties.length,
                inserted: inserted,
                failed: failed,
                makatiProperties: 40,
                taguigProperties: 35,
                pasayProperties: 25,
                priceRange: {
                    min: Math.min(...realisticProperties.map(p => p.totalSellingPrice)),
                    max: Math.max(...realisticProperties.map(p => p.totalSellingPrice)),
                    avg: Math.round(
                        realisticProperties.reduce((sum, p) => sum + p.totalSellingPrice, 0) /
                        realisticProperties.length
                    )
                },
                // Added pricing analysis for debugging
                pricingBreakdown: {
                    makatiRange: `₱${Math.min(...realisticProperties.slice(0, 40).map(p => p.totalSellingPrice)).toLocaleString()} - ₱${Math.max(...realisticProperties.slice(0, 40).map(p => p.totalSellingPrice)).toLocaleString()}`,
                    taguigRange: `₱${Math.min(...realisticProperties.slice(40, 75).map(p => p.totalSellingPrice)).toLocaleString()} - ₱${Math.max(...realisticProperties.slice(40, 75).map(p => p.totalSellingPrice)).toLocaleString()}`,
                    pasayRange: `₱${Math.min(...realisticProperties.slice(75, 100).map(p => p.totalSellingPrice)).toLocaleString()} - ₱${Math.max(...realisticProperties.slice(75, 100).map(p => p.totalSellingPrice)).toLocaleString()}`
                }
            }
        };
    }
});

// Keep the clearTestProperties function unchanged
export const clearTestProperties = mutation({
    handler: async (ctx) => {
        const properties = await ctx.db
            .query("property")
            .collect();

        const deletedCount = properties.length;

        for (const property of properties) {
            await ctx.db.delete(property._id);
        }

        return {
            success: true,
            message: `Deleted ${deletedCount} properties`,
            deletedCount
        };
    }
});