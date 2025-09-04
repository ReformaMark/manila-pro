"use client";

import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { toast } from "sonner";
import {
  AlertCircle,
  BarChart3,
  Brain,
  Calculator,
  CheckCircle,
  Info,
  RefreshCw,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatPrice } from "@/lib/utils";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const ForecastingPage = () => {
  const [isTraining, setIsTraining] = useState(false);
  const [forecastForm, setForecastForm] = useState({
    lotArea: "",
    bedrooms: "",
    bathrooms: "",
    storeys: "",
    unitType: "",
    city: "",
    amenitiesCount: "",
    facilitiesCount: "",
  });

  // Queries
  const activeModel = useQuery(api.forecasting.getActiveModel);
  const modelHistory = useQuery(api.forecasting.getModelHistory);
  const marketInsights = useQuery(api.forecasting.getMarketInsights);

  // Mutations
  const trainModel = useMutation(api.forecasting.trainPredictiveModel);
  const setActiveModel = useMutation(api.forecasting.setActiveModel);

  // Forecast price query
  const forecastData = useQuery(
    api.forecasting.forecastPrice,
    forecastForm.lotArea && forecastForm.unitType && forecastForm.city
      ? {
          lotArea: parseInt(forecastForm.lotArea),
          bedrooms: forecastForm.bedrooms
            ? parseInt(forecastForm.bedrooms)
            : undefined,
          bathrooms: forecastForm.bathrooms
            ? parseInt(forecastForm.bathrooms)
            : undefined,
          storeys: forecastForm.storeys || undefined,
          unitType: forecastForm.unitType,
          city: forecastForm.city as "Makati" | "Pasay" | "Taguig",
          amenitiesCount: forecastForm.amenitiesCount
            ? parseInt(forecastForm.amenitiesCount)
            : undefined,
          facilitiesCount: forecastForm.facilitiesCount
            ? parseInt(forecastForm.facilitiesCount)
            : undefined,
        }
      : "skip"
  );

  const handleTrainModel = async () => {
    setIsTraining(true);
    try {
      const result = await trainModel({});
      toast.success(result.message);
    } catch (error: any) {
      console.error("Training error:", error);

      let errorMessage =
        "Failed to train the forecasting model. Please try again.";

      if (error?.message) {
        // Check if it's a ConvexError with our custom message
        if (error.message.includes("Not enough properties")) {
          errorMessage =
            "❌ Insufficient Data: You need at least 5 properties to train the model. Please add more properties or use the seed data generator.";
        } else if (error.message.includes("No valid property data")) {
          errorMessage =
            "❌ No Valid Data: Please ensure your properties have complete information (price, lot area, bedrooms, etc.) before training.";
        } else if (error.message.includes("You must be logged in")) {
          errorMessage =
            "❌ Authentication Required: Please log in to train models.";
        } else if (
          error.message.includes("Failed to train the machine learning model")
        ) {
          errorMessage =
            "❌ Training Failed: There was an issue with the model training process. Please try again or contact support.";
        } else {
          // If we have a custom error message from the server, use it
          const customMessage = error.message.replace(/\[.*?\]/g, "").trim();
          if (customMessage && !customMessage.includes("Server Error")) {
            errorMessage = customMessage;
          }
        }
      }

      toast.error("Model Training Failed", {
        description: errorMessage,
        duration: 6000,
        action: {
          label: "Need Data?",
          onClick: () => window.open("/seller/seedit", "_blank"),
        },
      });
    } finally {
      setIsTraining(false);
    }
  };

  const handleSetActiveModel = async (modelId: string) => {
    try {
      await setActiveModel({ modelId: modelId as any });
      toast.success("Active model updated successfully");
    } catch (error) {
      toast.error("Failed to update active model");
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getModelPerformanceColor = (r2Score?: number) => {
    if (!r2Score) return "text-gray-500";
    if (r2Score >= 0.8) return "text-green-600";
    if (r2Score >= 0.6) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Brain className="h-8 w-8 text-orange-600" />
              Property Forecasting
            </h1>
            <p className="text-gray-600 mt-1">
              Machine Learning powered real estate price predictions and market
              insights
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 items-end">
            <Button
              onClick={handleTrainModel}
              disabled={
                isTraining ||
                !marketInsights ||
                (marketInsights?.totalProperties ?? 0) < 5
              }
              className="flex items-center gap-2"
              size="lg"
            >
              {isTraining ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Zap className="h-4 w-4" />
              )}
              {isTraining ? "Training Model..." : "Train New Model"}
            </Button>
            {(!marketInsights ||
              (marketInsights?.totalProperties ?? 0) < 5) && (
              <p className="text-xs text-red-600">
                Need {5 - (marketInsights?.totalProperties ?? 0)} more
                properties to train
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Model
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              {activeModel ? (
                <div>
                  <div className="text-2xl font-bold">
                    {activeModel.version}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Trained: {formatDate(activeModel.trainingDate)}
                  </p>
                  <div className="mt-2">
                    <Badge variant="secondary">
                      {activeModel.samplesUsed} samples
                    </Badge>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-2xl font-bold text-gray-400">
                    No Model
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Train a model to start forecasting
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Model Accuracy
              </CardTitle>
              <Target className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              {activeModel?.performance ? (
                <div>
                  <div
                    className={`text-2xl font-bold ${getModelPerformanceColor(activeModel.performance.r2Score)}`}
                  >
                    {activeModel.performance.r2Score
                      ? `${(activeModel.performance.r2Score * 100).toFixed(1)}%`
                      : "N/A"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    R² Score (Prediction accuracy)
                  </p>
                  <div className="mt-2">
                    <Badge variant="outline">
                      RMSE: ₱{activeModel.performance.rmse.toLocaleString()}
                    </Badge>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-2xl font-bold text-gray-400">-</div>
                  <p className="text-xs text-muted-foreground">
                    No performance data
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Market Data</CardTitle>
              <BarChart3 className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              {marketInsights ? (
                <div>
                  <div className="text-2xl font-bold">
                    {marketInsights.totalProperties}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Properties analyzed
                  </p>
                  <div className="mt-2">
                    <Badge variant="secondary">
                      Updated:{" "}
                      {formatDate(marketInsights.lastUpdated as number)}
                    </Badge>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-2xl font-bold text-gray-400">-</div>
                  <p className="text-xs text-muted-foreground">
                    Loading market data...
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <Info className="h-5 w-5" />
              Training Requirements
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div className="flex items-center justify-between">
              <span>Minimum properties needed:</span>
              <Badge
                variant={
                  marketInsights && (marketInsights.totalProperties ?? 0) >= 5
                    ? "default"
                    : "destructive"
                }
              >
                {marketInsights?.totalProperties || 0} / 5
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Recommended for best accuracy:</span>
              <Badge
                variant={
                  marketInsights && (marketInsights.totalProperties ?? 0) >= 50
                    ? "default"
                    : "secondary"
                }
              >
                {marketInsights?.totalProperties || 0} / 50+
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Price Forecasting Tool */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Property Price Forecasting
              </CardTitle>
              <CardDescription>
                Enter property details to get AI-powered price predictions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lotArea">Lot Area (sqm) *</Label>
                  <Input
                    id="lotArea"
                    type="number"
                    placeholder="120"
                    value={forecastForm.lotArea}
                    onChange={(e) =>
                      setForecastForm({
                        ...forecastForm,
                        lotArea: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    placeholder="3"
                    value={forecastForm.bedrooms}
                    onChange={(e) =>
                      setForecastForm({
                        ...forecastForm,
                        bedrooms: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    placeholder="2"
                    value={forecastForm.bathrooms}
                    onChange={(e) =>
                      setForecastForm({
                        ...forecastForm,
                        bathrooms: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeys">Storeys</Label>
                  <Input
                    id="storeys"
                    placeholder="2"
                    value={forecastForm.storeys}
                    onChange={(e) =>
                      setForecastForm({
                        ...forecastForm,
                        storeys: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="unitType">Unit Type *</Label>
                  <Select
                    value={forecastForm.unitType}
                    onValueChange={(value) =>
                      setForecastForm({ ...forecastForm, unitType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="condominium">Condominium</SelectItem>
                      <SelectItem value="duplex">Duplex</SelectItem>
                      <SelectItem value="single attached house">
                        Single Attached House
                      </SelectItem>
                      <SelectItem value="single detached house">
                        Single Detached House
                      </SelectItem>
                      <SelectItem value="townhouse/detached row house">
                        Townhouse
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Select
                    value={forecastForm.city}
                    onValueChange={(value) =>
                      setForecastForm({ ...forecastForm, city: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Makati">Makati</SelectItem>
                      <SelectItem value="Pasay">Pasay</SelectItem>
                      <SelectItem value="Taguig">Taguig</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Forecast Results
              </CardTitle>
              <CardDescription>
                Generated price prediction and confidence metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              {forecastData && forecastData.forecastedPrice ? (
                <div className="space-y-4">
                  <div className="text-center p-6 bg-gradient-to-r from-orange-50 to-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-orange-600 mb-2">
                      {formatPrice(forecastData.forecastedPrice)}
                    </div>
                    <p className="text-sm text-gray-600">
                      Predicted Property Value
                    </p>
                  </div>

                  {forecastData.confidence && (
                    <div className="space-y-3">
                      <h4 className="font-medium flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        Confidence Metrics
                      </h4>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="font-semibold text-green-600">
                            {forecastData.confidence.r2Score
                              ? `${(forecastData.confidence.r2Score * 100).toFixed(1)}%`
                              : "N/A"}
                          </div>
                          <div className="text-xs text-green-600">Accuracy</div>
                        </div>
                        <div className="text-center p-3 bg-yellow-50 rounded-lg">
                          <div className="font-semibold text-yellow-600">
                            ₱{forecastData.confidence.rmse?.toLocaleString()}
                          </div>
                          <div className="text-xs text-yellow-600">
                            Avg Error
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 space-y-1">
                        <div>Model: {forecastData.confidence.modelVersion}</div>
                        <div>
                          Training Data: {forecastData.confidence.samplesUsed}{" "}
                          properties
                        </div>
                        <div>
                          Last Trained:{" "}
                          {formatDate(forecastData.confidence.trainingDate)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : forecastData?.error ? (
                <div className="text-center p-6 text-red-600">
                  <AlertCircle className="h-12 w-12 mx-auto mb-2" />
                  <p>{forecastData.error}</p>
                </div>
              ) : (
                <div className="text-center p-6 text-gray-500">
                  <Calculator className="h-12 w-12 mx-auto mb-2" />
                  <p>Enter property details to get price forecast</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Market Insights */}
        {marketInsights && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Average Price by City</CardTitle>
                <CardDescription>
                  Market comparison across different cities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    price: {
                      label: "Average Price",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={marketInsights.avgPriceByCity}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="city" />
                      <YAxis
                        tickFormatter={(value) =>
                          `₱${(value / 1000000).toFixed(1)}M`
                        }
                      />
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                        formatter={(value: any) => [
                          formatPrice(value),
                          "Average Price",
                        ]}
                      />
                      <Bar dataKey="avgPrice" fill="var(--color-price)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Price per Sqm by Location</CardTitle>
                <CardDescription>
                  Land value comparison across cities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    pricePerSqm: {
                      label: "Price per Sqm",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={marketInsights.pricePerSqmInsights}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="city" />
                      <YAxis
                        tickFormatter={(value) =>
                          `₱${(value / 1000).toFixed(0)}K`
                        }
                      />
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                        formatter={(value: any) => [
                          `₱${value.toLocaleString()}`,
                          "Price per Sqm",
                        ]}
                      />
                      <Bar
                        dataKey="avgPricePerSqm"
                        fill="var(--color-pricePerSqm)"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Model History */}
        {modelHistory && modelHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Model History & Performance</CardTitle>
              <CardDescription>
                Track your ML model versions and their performance over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {modelHistory.map((model) => (
                  <div
                    key={model.id}
                    className={`p-4 border rounded-lg ${
                      model.isActive
                        ? "border-orange-200 bg-orange-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{model.version}</h4>
                          {model.isActive && (
                            <Badge variant="default">Active</Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          Trained: {formatDate(model.trainingDate)}
                        </div>
                        <div className="flex gap-4 text-sm">
                          <span>Samples: {model.samplesUsed}</span>
                          <span
                            className={getModelPerformanceColor(
                              model.performance.r2Score
                            )}
                          >
                            R²:{" "}
                            {model.performance.r2Score
                              ? (model.performance.r2Score * 100).toFixed(1) +
                                "%"
                              : "N/A"}
                          </span>
                          <span>
                            RMSE: ₱{model.performance.rmse?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      {!model.isActive && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetActiveModel(model.id)}
                        >
                          Set Active
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ForecastingPage;
