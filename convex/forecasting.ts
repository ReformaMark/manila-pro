import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { Doc } from "./_generated/dataModel";

class LinearRegression {
    private weights: number[] = [];
    private bias: number = 0;
    private trained: boolean = false;

    train(X: number[][], y: number[]): void {
        console.log('Training with:', { samples: X.length, features: X[0]?.length, prices: y.length });

        if (X.length === 0 || X.length !== y.length) {
            throw new Error("Invalid training data");
        }

        // Validate input data
        for (let i = 0; i < y.length; i++) {
            if (isNaN(y[i]) || !isFinite(y[i]) || y[i] <= 0) {
                throw new Error(`Invalid price at index ${i}: ${y[i]}`);
            }
        }

        for (let i = 0; i < X.length; i++) {
            for (let j = 0; j < X[i].length; j++) {
                if (isNaN(X[i][j]) || !isFinite(X[i][j])) {
                    throw new Error(`Invalid feature at [${i}][${j}]: ${X[i][j]}`);
                }
            }
        }

        // Use gradient descent directly (much faster for serverless)
        console.log('Using optimized gradient descent for serverless environment');
        this.trainWithGradientDescent(X, y);
    }

    private trainWithGradientDescent(X: number[][], y: number[]): void {
        const m = X.length;
        const n = X[0].length;

        // Initialize weights randomly (better than zeros)
        this.weights = Array(n).fill(0).map(() => (Math.random() - 0.5) * 0.01);
        this.bias = 0;

        // Normalize features and prices for better convergence
        const maxPrice = Math.max(...y);
        const minPrice = Math.min(...y);
        const priceRange = maxPrice - minPrice;

        if (priceRange === 0) {
            throw new Error("All prices are identical - cannot train model");
        }

        const normalizedY = y.map(price => (price - minPrice) / priceRange);

        // Feature normalization
        const featureStats = X[0].map((_, j) => {
            const values = X.map(row => row[j]);
            const min = Math.min(...values);
            const max = Math.max(...values);
            const range = max - min;
            return { min, max, range };
        });

        const normalizedX = X.map(row =>
            row.map((val, j) => {
                const stat = featureStats[j];
                return stat.range > 0 ? (val - stat.min) / stat.range : 0;
            })
        );

        // Optimized hyperparameters for faster convergence
        const learningRate = 0.1; // Much higher learning rate with normalized data
        const maxIterations = 2000; // Reduced iterations to stay under timeout
        const tolerance = 1e-6;

        let prevCost = Infinity;
        let stagnantCount = 0;

        console.log('Starting gradient descent...');

        for (let iter = 0; iter < maxIterations; iter++) {
            // Forward pass
            const predictions = normalizedX.map(row =>
                this.bias + this.weights.reduce((sum, w, i) => sum + w * row[i], 0)
            );

            // Calculate cost
            const errors = predictions.map((pred, i) => pred - normalizedY[i]);
            const cost = errors.reduce((sum, error) => sum + error * error, 0) / (2 * m);

            if (isNaN(cost)) {
                throw new Error('Cost became NaN during training');
            }

            // Check for convergence
            const costChange = Math.abs(prevCost - cost);
            if (costChange < tolerance) {
                stagnantCount++;
                if (stagnantCount >= 5) {
                    console.log(`Converged at iteration ${iter} with cost ${cost}`);
                    break;
                }
            } else {
                stagnantCount = 0;
            }

            // Gradient computation and updates
            const biasGradient = errors.reduce((sum, error) => sum + error, 0) / m;
            this.bias -= learningRate * biasGradient;

            // Vectorized weight updates
            for (let j = 0; j < this.weights.length; j++) {
                const weightGradient = errors.reduce((sum, error, i) =>
                    sum + error * normalizedX[i][j], 0) / m;
                this.weights[j] -= learningRate * weightGradient;
            }

            prevCost = cost;

            // Log progress less frequently to avoid timeout
            if (iter % 500 === 0) {
                console.log(`Iteration ${iter}, Cost: ${cost.toFixed(6)}`);
            }
        }

        // Denormalize weights and bias back to original scale
        const denormalizedWeights = this.weights.map((w, j) => {
            const stat = featureStats[j];
            return stat.range > 0 ? w * priceRange / stat.range : 0;
        });

        const biasAdjustment = denormalizedWeights.reduce((sum, w, j) => {
            const stat = featureStats[j];
            return sum - w * stat.min;
        }, 0);

        this.weights = denormalizedWeights;
        this.bias = this.bias * priceRange + minPrice + biasAdjustment;

        // Validate final model
        if (isNaN(this.bias) || this.weights.some(w => isNaN(w) || !isFinite(w))) {
            throw new Error("Training produced invalid weights or bias");
        }

        this.trained = true;
        console.log('Gradient descent training completed successfully');
        console.log('Final weights:', this.weights.map(w => w.toFixed(2)).slice(0, 5));
        console.log('Final bias:', this.bias.toFixed(2));
    }

    predict(x: number[]): number {
        if (!this.trained) {
            throw new Error("Model must be trained before making predictions");
        }

        if (x.length !== this.weights.length) {
            throw new Error(`Feature vector length mismatch. Expected ${this.weights.length}, got ${x.length}`);
        }

        const prediction = this.bias + this.weights.reduce((sum, weight, i) => sum + weight * x[i], 0);

        if (isNaN(prediction) || !isFinite(prediction)) {
            throw new Error("Prediction resulted in NaN or infinite value");
        }

        return Math.max(0, prediction); // Ensure non-negative price
    }
}

function preprocessPropertyData(properties: Doc<"property">[]) {
    const processedData: number[][] = [];
    const prices: number[] = [];

    const unitTypes = ["apartment", "condominium", "duplex", "single attached house",
        "single detached house", "townhouse/detached row house"];
    const cities = ["Makati", "Pasay", "Taguig"];

    for (const property of properties) {
        // 🔧 FIX: Only include "Buy" transactions for purchase price forecasting
        if (property.transactionType !== "Buy") continue;

        if (!property.totalSellingPrice || property.totalSellingPrice <= 0) continue;

        const features: number[] = []

        features.push(property.lotArea || 0)
        features.push(property.bedrooms || 0)
        features.push(property.bathrooms || 0)

        const storeyCount = property.storeys ? parseInt(property.storeys) || 1 : 1;
        features.push(storeyCount)

        unitTypes.forEach(type => {
            features.push(property.unitType === type ? 1 : 0);
        });

        cities.forEach(city => {
            features.push(property.city === city ? 1 : 0);
        });

        features.push(property.amenities ? property.amenities.length : 0);
        features.push(property.facilities ? property.facilities.length : 0);

        processedData.push(features);
        prices.push(property.totalSellingPrice);
    }

    return { features: processedData, prices };
}

// model trainer and storing coefficients
export const trainPredictiveModel = mutation({
    args: {},
    handler: async (ctx) => {
        try {
            // fetch properties
            const properties = await ctx.db
                .query("property")
                .collect();

            if (properties.length < 10) {
                throw new ConvexError("Insufficient data for training (minimum 10 properties required)");
            }

            const { features, prices } = preprocessPropertyData(properties);

            if (features.length < 5) {
                throw new ConvexError("Insufficient valid properties for training");
            }

            // if it passed the conditions, then train model
            const model = new LinearRegression()
            model.train(features, prices);

            // Calculate performance metrics
            const predictions = features.map(f => model.predict(f));
            const mse = predictions.reduce((sum, pred, i) => sum + Math.pow(pred - prices[i], 2), 0) / predictions.length;
            const rmse = Math.sqrt(mse);
            const mae = predictions.reduce((sum, pred, i) => sum + Math.abs(pred - prices[i]), 0) / predictions.length;

            // Calculate R² score
            const meanPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
            const totalSumSquares = prices.reduce((sum, price) => sum + Math.pow(price - meanPrice, 2), 0);
            const residualSumSquares = predictions.reduce((sum, pred, i) => sum + Math.pow(prices[i] - pred, 2), 0);
            const r2Score = 1 - (residualSumSquares / totalSumSquares);

            const existingModels = await ctx.db
                .query("ml_models")
                .filter((q) => q.eq(q.field("modelType"), "linear_regression_price_forecast"))
                .filter((q) => q.eq(q.field("isActive"), true))
                .collect();

            for (const existingModel of existingModels) {
                await ctx.db.patch(existingModel._id, { isActive: false });
            }

            // Store new model in database
            const modelId = await ctx.db.insert("ml_models", {
                modelType: "linear_regression_price_forecast",
                version: `v${Date.now()}`, // Simple versioning
                weights: (model as any).weights,
                bias: (model as any).bias,
                trainingDate: Date.now(),
                samplesUsed: features.length,
                performance: {
                    rmse: Math.round(rmse),
                    mae: Math.round(mae),
                    r2Score: parseFloat(r2Score.toFixed(4)),
                },
                features: [
                    "lotArea", "bedrooms", "bathrooms", "storeys",
                    "apartment", "condominium", "duplex", "single_attached_house",
                    "single_detached_house", "townhouse_detached_row_house",
                    "Makati", "Pasay", "Taguig",
                    "amenitiesCount", "facilitiesCount"
                ],
                isActive: true,
                trainingMetadata: {
                    minPrice: Math.min(...prices),
                    maxPrice: Math.max(...prices),
                    avgPrice: Math.round(meanPrice),
                    totalProperties: properties.length,
                },
            });

            return {
                success: true,
                message: `Model trained successfully with ${features.length} samples`,
                modelId,
                performance: {
                    rmse: Math.round(rmse),
                    mae: Math.round(mae),
                    r2Score: parseFloat(r2Score.toFixed(4)),
                    samplesUsed: features.length,
                }
            };

        } catch (error) {
            throw new ConvexError(`Training failed: ${error}`);
        }
    }
});

// Get the active model from database
export const getActiveModel = query({
    args: {},
    handler: async (ctx) => {
        const activeModel = await ctx.db
            .query("ml_models")
            .filter((q) => q.eq(q.field("modelType"), "linear_regression_price_forecast"))
            .filter((q) => q.eq(q.field("isActive"), true))
            .order("desc")
            .first();

        return activeModel;
    }
});

// predict property price
export const forecastPrice = query({
    args: {
        lotArea: v.number(),
        bedrooms: v.optional(v.number()),
        bathrooms: v.optional(v.number()),
        storeys: v.optional(v.string()),
        unitType: v.string(),
        city: v.union(v.literal("Makati"), v.literal("Pasay"), v.literal("Taguig")),
        amenitiesCount: v.optional(v.number()),
        facilitiesCount: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        try {
            // Get active model from database
            const activeModel = await ctx.db
                .query("ml_models")
                .filter((q) => q.eq(q.field("modelType"), "linear_regression_price_forecast"))
                .filter((q) => q.eq(q.field("isActive"), true))
                .order("desc")
                .first();

            if (!activeModel) {
                return {
                    forecastedPrice: null,
                    error: "No trained model available. Please train a model first."
                };
            }

            // Create model instance from stored data
            const model = new LinearRegression();
            (model as any).weights = activeModel.weights;
            (model as any).bias = activeModel.bias;
            (model as any).trained = true;

            // Prepare input features for prediction
            const inputFeatures: number[] = [];

            // Numerical features
            inputFeatures.push(args.lotArea);
            inputFeatures.push(args.bedrooms || 0);
            inputFeatures.push(args.bathrooms || 0);

            // Storeys
            const storeyCount = args.storeys ? parseInt(args.storeys) || 1 : 1;
            inputFeatures.push(storeyCount);

            // One-hot encode unit type
            const unitTypes = ["apartment", "condominium", "duplex", "single attached house",
                "single detached house", "townhouse/detached row house"];
            unitTypes.forEach(type => {
                inputFeatures.push(args.unitType === type ? 1 : 0);
            });

            // One-hot encode city
            const cities = ["Makati", "Pasay", "Taguig"];
            cities.forEach(city => {
                inputFeatures.push(args.city === city ? 1 : 0);
            });

            // Count features
            inputFeatures.push(args.amenitiesCount || 0);
            inputFeatures.push(args.facilitiesCount || 0);

            // Make prediction
            const predictedPrice = model.predict(inputFeatures);

            return {
                forecastedPrice: Math.round(predictedPrice),
                confidence: {
                    rmse: activeModel.performance.rmse,
                    r2Score: activeModel.performance.r2Score,
                    samplesUsed: activeModel.samplesUsed,
                    trainingDate: activeModel.trainingDate,
                    modelVersion: activeModel.version,
                }
            };
        } catch (error) {
            return {
                forecastedPrice: null,
                error: `Forecasting failed: ${error}`
            };
        }
    }
});

// Get model history and performance
export const getModelHistory = query({
    args: {},
    handler: async (ctx) => {
        const models = await ctx.db
            .query("ml_models")
            .filter((q) => q.eq(q.field("modelType"), "linear_regression_price_forecast"))
            .order("desc")
            .collect();

        return models.map(model => ({
            id: model._id,
            version: model.version,
            trainingDate: model.trainingDate,
            samplesUsed: model.samplesUsed,
            performance: model.performance,
            isActive: model.isActive,
            trainingMetadata: model.trainingMetadata,
        }));
    }
});

// Switch active model
export const setActiveModel = mutation({
    args: {
        modelId: v.id("ml_models")
    },
    handler: async (ctx, args) => {
        // Deactivate all models
        const allModels = await ctx.db
            .query("ml_models")
            .filter((q) => q.eq(q.field("modelType"), "linear_regression_price_forecast"))
            .collect();

        for (const model of allModels) {
            await ctx.db.patch(model._id, { isActive: false });
        }

        // Activate selected model
        await ctx.db.patch(args.modelId, { isActive: true });

        return { success: true, message: "Active model updated successfully" };
    }
});

// Get market insights
export const getMarketInsights = query({
    args: {},
    handler: async (ctx) => {
        const properties = await ctx.db
            .query("property")
            .collect()

        if (properties.length === 0) {
            return { error: "No properties available for analysis" };
        }

        // Price analysis by city
        const priceByCity: Record<string, number[]> = {};
        const priceByUnitType: Record<string, number[]> = {};

        properties.forEach(prop => {
            if (prop.totalSellingPrice > 0) {
                // Group by city
                if (!priceByCity[prop.city]) priceByCity[prop.city] = [];
                priceByCity[prop.city].push(prop.totalSellingPrice);

                // Group by unit type
                if (!priceByUnitType[prop.unitType]) priceByUnitType[prop.unitType] = [];
                priceByUnitType[prop.unitType].push(prop.totalSellingPrice);
            }
        });

        // Calculate averages
        const avgPriceByCity = Object.entries(priceByCity).map(([city, prices]) => ({
            city,
            avgPrice: Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length),
            count: prices.length
        }));

        const avgPriceByUnitType = Object.entries(priceByUnitType).map(([type, prices]) => ({
            unitType: type,
            avgPrice: Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length),
            count: prices.length
        }));

        const pricePerSqmData = properties
            .filter(p => p.pricePerSqm > 0)
            .map(p => ({ city: p.city, pricePerSqm: p.pricePerSqm }));

        const avgPricePerSqmByCity = pricePerSqmData.reduce((acc, curr) => {
            if (!acc[curr.city]) acc[curr.city] = [];
            acc[curr.city].push(curr.pricePerSqm);
            return acc;
        }, {} as Record<string, number[]>);

        const pricePerSqmInsights = Object.entries(avgPricePerSqmByCity).map(([city, prices]) => ({
            city,
            avgPricePerSqm: Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length)
        }));

        return {
            totalProperties: properties.length,
            avgPriceByCity,
            avgPriceByUnitType,
            pricePerSqmInsights,
            lastUpdated: Date.now()
        };
    }
});

// Update property with forecasted price
export const updatePropertyForecast = mutation({
    args: {
        propertyId: v.id("property")
    },
    handler: async (ctx, args) => {
        const property = await ctx.db.get(args.propertyId)
        if (!property) {
            throw new ConvexError("Property not found")
        }

        try {
            // Get all properties for training
            const allProperties = await ctx.db
                .query("property")
                .collect();
            const { features, prices } = preprocessPropertyData(allProperties);

            if (features.length < 5) {
                throw new ConvexError("Insufficient data for forecasting");
            }

            // train model
            const model = new LinearRegression();
            model.train(features, prices)

            // Prepare features for this property
            const inputFeatures: number[] = [];

            inputFeatures.push(property.lotArea || 0);
            inputFeatures.push(property.bedrooms || 0);
            inputFeatures.push(property.bathrooms || 0);

            const storeyCount = property.storeys ? parseInt(property.storeys) || 1 : 1;
            inputFeatures.push(storeyCount);

            // One-hot encode unit type
            const unitTypes = ["apartment", "condominium", "duplex", "single attached house",
                "single detached house", "townhouse/detached row house"];
            unitTypes.forEach(type => {
                inputFeatures.push(property.unitType === type ? 1 : 0);
            });

            // One-hot encode city
            const cities = ["Makati", "Pasay", "Taguig"];
            cities.forEach(city => {
                inputFeatures.push(property.city === city ? 1 : 0);
            });

            inputFeatures.push(property.amenities ? property.amenities.length : 0);
            inputFeatures.push(property.facilities ? property.facilities.length : 0);

            // Make prediction
            const forecastedPrice = Math.round(model.predict(inputFeatures));

            // Update property with forecast
            await ctx.db.patch(args.propertyId, {
                forecastedPrice,
                forecastedDate: Date.now()
            });

            return {
                success: true,
                forecastedPrice,
                message: "Property forecast updated successfully"
            };
        } catch (error) {
            throw new ConvexError(`Failed to update forecast: ${error}`);
        }
    }
})

export const debugTraining = query({
    args: {},
    handler: async (ctx) => {
        const properties = await ctx.db.query("property").collect();
        const { features, prices } = preprocessPropertyData(properties);

        // Sample the first few entries to see the data structure
        return {
            totalProperties: properties.length,
            validForTraining: features.length,
            sampleProperty: properties[0] ? {
                name: properties[0].propertyName,
                price: properties[0].totalSellingPrice,
                lotArea: properties[0].lotArea,
                city: properties[0].city,
                unitType: properties[0].unitType,
            } : null,
            sampleFeatures: features[0] || null,
            samplePrice: prices[0] || null,
            featureLength: features[0]?.length || 0,
            priceStats: prices.length > 0 ? {
                min: Math.min(...prices),
                max: Math.max(...prices),
                avg: prices.reduce((sum, p) => sum + p, 0) / prices.length,
                hasZeros: prices.filter(p => p <= 0).length,
                hasNaN: prices.filter(p => isNaN(p)).length,
            } : null,
            featureStats: features.length > 0 ? {
                hasNaN: features.some(f => f.some(val => isNaN(val))),
                hasInfinity: features.some(f => f.some(val => !isFinite(val))),
            } : null
        };
    }
});