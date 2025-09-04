"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation } from "convex/react";
import { Database, Trash2, Loader2, Zap, BarChart3 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "../../../../convex/_generated/api";

const SeeditPage = () => {
  const [isGeneratingRealistic, setIsGeneratingRealistic] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  // Mutations
  const createRealisticProperties = useMutation(
    api.seedProp.createRealisticPropertyData
  );
  const clearTestProperties = useMutation(api.seedProp.clearTestProperties);

  const handleGenerateRealistic = async () => {
    setIsGeneratingRealistic(true);
    try {
      const result = await createRealisticProperties({});
      toast.success(`${result.message}`);
      console.log("Generated realistic properties:", result.summary);
    } catch (error) {
      toast.error("Failed to generate realistic properties: " + error);
      console.error("Realistic generation error:", error);
    } finally {
      setIsGeneratingRealistic(false);
    }
  };

  const handleClear = async () => {
    setIsClearing(true);
    try {
      const result = await clearTestProperties({});
      toast.success(result.message);
      console.log("Cleared properties:", result);
    } catch (error) {
      toast.error("Failed to clear test properties: " + error);
      console.error("Clear error:", error);
    } finally {
      setIsClearing(false);
    }
  };

  const isAnyLoading = isGeneratingRealistic || isClearing;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            🧪 Developer Seed Tool
          </h1>
          <p className="text-gray-600 mt-2">
            Generate test property data for ML forecasting development and
            capstone demonstration
          </p>
        </div>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Property Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 100 Realistic Properties */}
              <Button
                onClick={handleGenerateRealistic}
                disabled={isAnyLoading}
                className="flex items-center gap-2 h-16 flex-col bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isGeneratingRealistic ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <BarChart3 className="h-5 w-5" />
                )}
                <div className="text-center">
                  <div className="font-semibold">
                    {isGeneratingRealistic
                      ? "Generating..."
                      : "100 Realistic Properties"}
                  </div>
                  <div className="text-xs text-white/90">
                    Perfect for ML training
                  </div>
                </div>
              </Button>

              {/* Clear All */}
              <Button
                onClick={handleClear}
                disabled={isAnyLoading}
                variant="destructive"
                className="flex items-center gap-2 h-16 flex-col"
              >
                {isClearing ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Trash2 className="h-5 w-5" />
                )}
                <div className="text-center">
                  <div className="font-semibold">
                    {isClearing ? "Clearing..." : "Clear All Data"}
                  </div>
                  <div className="text-xs text-red-200">Remove everything</div>
                </div>
              </Button>
            </div>

            <div className="text-sm text-gray-500 space-y-1 pt-4 border-t">
              <p>
                • <strong>Realistic:</strong> 100 properties with proper pricing
                logic for ML training
              </p>
              <p>
                • <strong>Clear:</strong> Removes ALL properties from the
                database
              </p>
              <p>• Check browser console for detailed results</p>
            </div>
          </CardContent>
        </Card>

        {/* Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sample Properties Info */}

          {/* Realistic Properties Info */}
          <Card className="border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                100 Realistic Properties
                <span className="text-xs bg-gradient-to-r from-blue-600 to-purple-600 text-white px-2 py-1 rounded">
                  RECOMMENDED
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-blue-50 rounded">
                  <div className="font-semibold text-blue-600">35</div>
                  <div className="text-xs text-blue-600">Makati</div>
                </div>
                <div className="p-2 bg-green-50 rounded">
                  <div className="font-semibold text-green-600">35</div>
                  <div className="text-xs text-green-600">Taguig</div>
                </div>
                <div className="p-2 bg-purple-50 rounded">
                  <div className="font-semibold text-purple-600">30</div>
                  <div className="text-xs text-purple-600">Pasay</div>
                </div>
              </div>
              <div className="pt-2 border-t text-xs">
                <p>
                  <strong>Purpose:</strong> Proper ML training & capstone demo
                </p>
                <p>
                  <strong>Price Range:</strong> ₱3M - ₱35M (realistic spread)
                </p>
                <p>
                  <strong>Features:</strong> Mathematical pricing logic
                </p>
                <p>
                  <strong>ML Performance:</strong> High accuracy (95%+ expected)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Recommended Workflow
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <ol className="list-decimal list-inside space-y-2">
              <li>Use "100 Realistic Properties" for best ML results</li>
              <li>
                Go to{" "}
                <code className="bg-gray-100 px-1 rounded">
                  /seller/forecasting
                </code>{" "}
                after generating data
              </li>
              <li>Click "Train New Model" - should achieve 95%+ accuracy</li>
              <li>Test predictions with realistic property features</li>
              <li>Show market insights charts for presentation</li>
              <li>Compare model versions in history section</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SeeditPage;
