import { Doc, Id } from "../convex/_generated/dataModel";

export function getDummyProperties(): Doc<"property">[] {
    return [
        {
            _id: "prop1" as Id<"property">,
            address: "Pio Del Pilar, Makati City",
            bedrooms: "3",
            block: "1",
            city: "Makati",
            createdAt: 1742295630,
            displayImage: "https://xnp6i843pr.ufs.sh/f/0VXm2UCFbuqyeopkqobxTygj1htw8bnLkXUqmKGlfWCxO6cA",
            otherImage: [
                "https://xnp6i843pr.ufs.sh/f/0VXm2UCFbuqy7vP0OcBnKIH8ArFdtisRwYo6QhmW51uLDcXC", // 2
                "https://xnp6i843pr.ufs.sh/f/0VXm2UCFbuqy4Dgsi6JmbaOgkYU9rs75BRe12DlA3fztEQFq", // 3
                "https://xnp6i843pr.ufs.sh/f/0VXm2UCFbuqy4lebdV6JmbaOgkYU9rs75BRe12DlA3fztEQF", // 4
                "https://xnp6i843pr.ufs.sh/f/0VXm2UCFbuqyKlunBjiPBf3thrFT8KqjxSQZXgbnswvMINU2", // 5
            ],
            lot: "3",
            lotArea: 60,
            lotId: "L-123",
            maximumOccupants: "5-10",
            netContractPrice: 1800000,
            pricePerSqm: 30000,
            propertyName: "Commercial-Residential Vacant Lot for Sale in Pio del Pilar, Makati City",
            sellerId: "kh76tc5yzxenhjfb38n4tfbjts79xbyq" as Id<"users">,
            status: "available",
            suggestedMonthlyAmortization: 30000,
            suggestedTermInMonths: 60,
            totalContractPrice: 1800000,
            totalSellingPrice: 1750000,
            transactionType: "Buy",
            unitType: "single attached house",
            updatedAt: 0,
            _creationTime: 1742297180711.6162,
        },
        {
            _id: "prop2" as Id<"property">,
            address: "Poblacion, Makati City",
            bedrooms: "2",
            block: "5",
            city: "Makati",
            createdAt: 1741295630,
            displayImage: "https://xnp6i843pr.ufs.sh/f/0VXm2UCFbuqy7vP0OcBnKIH8ArFdtisRwYo6QhmW51uLDcXC",
            lot: "7",
            lotArea: 45,
            lotId: "L-456",
            maximumOccupants: "3-5",
            netContractPrice: 2200000,
            otherImage: [
                "https://xnp6i843pr.ufs.sh/f/0VXm2UCFbuqyeopkqobxTygj1htw8bnLkXUqmKGlfWCxO6cA", // 1
                "https://xnp6i843pr.ufs.sh/f/0VXm2UCFbuqy4Dgsi6JmbaOgkYU9rs75BRe12DlA3fztEQFq", // 3
                "https://xnp6i843pr.ufs.sh/f/0VXm2UCFbuqy4lebdV6JmbaOgkYU9rs75BRe12DlA3fztEQF", // 4
                "https://xnp6i843pr.ufs.sh/f/0VXm2UCFbuqyKlunBjiPBf3thrFT8KqjxSQZXgbnswvMINU2", // 5
            ],
            pricePerSqm: 48000,
            propertyName: "Modern Condominium Unit in Poblacion, Makati City",
            sellerId: "kh76tc5yzxenhjfb38n4tfbjts79xbyq" as Id<"users">,
            status: "reserved",
            suggestedMonthlyAmortization: 36000,
            suggestedTermInMonths: 60,
            totalContractPrice: 2200000,
            totalSellingPrice: 2150000,
            transactionType: "Buy",
            unitType: "condominium",
            updatedAt: 0,
            _creationTime: 1742297180711.6162,
        },
        {
            _id: "prop3" as Id<"property">,
            address: "BGC, Taguig City",
            bedrooms: "4",
            block: "12",
            city: "Taguig",
            createdAt: 1740295630,
            displayImage: "https://xnp6i843pr.ufs.sh/f/0VXm2UCFbuqy4Dgsi6JmbaOgkYU9rs75BRe12DlA3fztEQFq",
            lot: "9",
            lotArea: 120,
            lotId: "L-789",
            maximumOccupants: "8-10",
            netContractPrice: 5500000,
            otherImage: [
                "https://xnp6i843pr.ufs.sh/f/0VXm2UCFbuqyeopkqobxTygj1htw8bnLkXUqmKGlfWCxO6cA", // 1
                "https://xnp6i843pr.ufs.sh/f/0VXm2UCFbuqy7vP0OcBnKIH8ArFdtisRwYo6QhmW51uLDcXC", // 2
                "https://xnp6i843pr.ufs.sh/f/0VXm2UCFbuqy4lebdV6JmbaOgkYU9rs75BRe12DlA3fztEQF", // 4
                "https://xnp6i843pr.ufs.sh/f/0VXm2UCFbuqyKlunBjiPBf3thrFT8KqjxSQZXgbnswvMINU2", // 5
            ],
            pricePerSqm: 45000,
            propertyName: "Luxury Townhouse in BGC, Taguig City",
            sellerId: "kh76tc5yzxenhjfb38n4tfbjts79xbyq" as Id<"users">,
            status: "sold",
            suggestedMonthlyAmortization: 92000,
            suggestedTermInMonths: 60,
            totalContractPrice: 5500000,
            totalSellingPrice: 5300000,
            transactionType: "Buy",
            unitType: "townhouse",
            updatedAt: 0,
            _creationTime: 1742297180711.6162
        },
        {
            _id: "prop4" as Id<"property">,
            address: "Pasay City",
            bedrooms: "3",
            block: "3",
            city: "Pasay",
            createdAt: 1739295630,
            displayImage: "https://xnp6i843pr.ufs.sh/f/0VXm2UCFbuqy4lebdV6JmbaOgkYU9rs75BRe12DlA3fztEQF",
            lot: "5",
            lotArea: 80,
            lotId: "L-321",
            maximumOccupants: "6-8",
            netContractPrice: 3200000,
            otherImage: [
                "https://xnp6i843pr.ufs.sh/f/0VXm2UCFbuqyeopkqobxTygj1htw8bnLkXUqmKGlfWCxO6cA", // 1
                "https://xnp6i843pr.ufs.sh/f/0VXm2UCFbuqy7vP0OcBnKIH8ArFdtisRwYo6QhmW51uLDcXC", // 2
                "https://xnp6i843pr.ufs.sh/f/0VXm2UCFbuqy4Dgsi6JmbaOgkYU9rs75BRe12DlA3fztEQFq", // 3
                "https://xnp6i843pr.ufs.sh/f/0VXm2UCFbuqyKlunBjiPBf3thrFT8KqjxSQZXgbnswvMINU2", // 5
            ],
            pricePerSqm: 40000,
            propertyName: "Family Home in Pasay City",
            sellerId: "kh76tc5yzxenhjfb38n4tfbjts79xbyq" as Id<"users">,
            status: "available",
            suggestedMonthlyAmortization: 53000,
            suggestedTermInMonths: 60,
            totalContractPrice: 3200000,
            totalSellingPrice: 3100000,
            transactionType: "Buy",
            unitType: "single detached house",
            updatedAt: 0,
            _creationTime: 1742297180711.6162,
        },
        {
            _id: "prop5" as Id<"property">,
            address: "San Lorenzo, Makati City",
            bedrooms: "1",
            block: "8",
            city: "Makati",
            createdAt: 1738295630,
            displayImage: "https://xnp6i843pr.ufs.sh/f/0VXm2UCFbuqyKlunBjiPBf3thrFT8KqjxSQZXgbnswvMINU2",
            lot: "2",
            lotArea: 35,
            lotId: "L-654",
            maximumOccupants: "2-3",
            netContractPrice: 1500000,
            otherImage: [
                "https://xnp6i843pr.ufs.sh/f/0VXm2UCFbuqyeopkqobxTygj1htw8bnLkXUqmKGlfWCxO6cA", // 1
                "https://xnp6i843pr.ufs.sh/f/0VXm2UCFbuqy7vP0OcBnKIH8ArFdtisRwYo6QhmW51uLDcXC", // 2
                "https://xnp6i843pr.ufs.sh/f/0VXm2UCFbuqy4Dgsi6JmbaOgkYU9rs75BRe12DlA3fztEQFq", // 3
                "https://xnp6i843pr.ufs.sh/f/0VXm2UCFbuqy4lebdV6JmbaOgkYU9rs75BRe12DlA3fztEQF", // 4
            ],
            pricePerSqm: 42000,
            propertyName: "Studio Unit in San Lorenzo, Makati City",
            sellerId: "kh76tc5yzxenhjfb38n4tfbjts79xbyq" as Id<"users">,
            status: "available",
            suggestedMonthlyAmortization: 25000,
            suggestedTermInMonths: 60,
            totalContractPrice: 1500000,
            totalSellingPrice: 1450000,
            transactionType: "Buy",
            unitType: "condominium",
            updatedAt: 0,
            _creationTime: 1742297180711.6162,
        },
    ]
}
