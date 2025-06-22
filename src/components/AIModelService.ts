// AI Model Service for Price Forecasting
export interface MarketData {
  propertyType: string;
  location: string;
  area: number;
  currentPrice: number;
  historicalPrices: number[];
  marketIndicators: {
    gdpGrowth: number;
    interestRate: number;
    inflationRate: number;
    populationGrowth: number;
    constructionIndex: number;
  };
}

export interface ForecastResult {
  predictions: Array<{
    period: string;
    price: number;
    confidence: number;
    volatility: number;
  }>;
  factors: Array<{
    name: string;
    weight: number;
    impact: 'positive' | 'negative' | 'neutral';
  }>;
  riskAssessment: {
    level: 'low' | 'medium' | 'high';
    factors: string[];
  };
}

class AIModelService {
  private static instance: AIModelService;
  private modelWeights: Record<string, number> = {
    location: 0.35,
    propertyType: 0.15,
    area: 0.20,
    marketTrends: 0.30
  };

  public static getInstance(): AIModelService {
    if (!AIModelService.instance) {
      AIModelService.instance = new AIModelService();
    }
    return AIModelService.instance;
  }

  // Simulate neural network prediction
  public async predictPrice(data: MarketData, periods: string[]): Promise<ForecastResult> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const basePrice = data.currentPrice;
    const locationMultiplier = this.getLocationMultiplier(data.location);
    const propertyTypeMultiplier = this.getPropertyTypeMultiplier(data.propertyType);
    const areaMultiplier = this.getAreaMultiplier(data.area);
    
    const predictions = periods.map((period, index) => {
      const timeMultiplier = this.getTimeMultiplier(period);
      const marketVolatility = this.calculateMarketVolatility(data.marketIndicators);
      
      // Advanced price prediction algorithm
      const trendFactor = this.calculateTrendFactor(data.marketIndicators);
      const seasonalFactor = this.getSeasonalFactor();
      const riskFactor = this.calculateRiskFactor(data.location, data.propertyType);
      
      const predictedPrice = basePrice * 
        locationMultiplier * 
        propertyTypeMultiplier * 
        areaMultiplier * 
        timeMultiplier * 
        trendFactor * 
        seasonalFactor * 
        (1 + (Math.random() - 0.5) * 0.1); // Add some randomness
      
      const confidence = Math.max(95 - (index * 5) - (marketVolatility * 10), 60);
      
      return {
        period,
        price: predictedPrice,
        confidence,
        volatility: marketVolatility
      };
    });

    const factors = this.analyzePriceFactors(data);
    const riskAssessment = this.assessRisk(data);

    return {
      predictions,
      factors,
      riskAssessment
    };
  }

  private getLocationMultiplier(location: string): number {
    const multipliers: Record<string, number> = {
      bangkok: 1.2,
      nonthaburi: 1.1,
      pathum_thani: 1.05,
      samut_prakan: 1.0,
      chiang_mai: 0.95,
      phuket: 1.15
    };
    return multipliers[location] || 1.0;
  }

  private getPropertyTypeMultiplier(propertyType: string): number {
    const multipliers: Record<string, number> = {
      condo: 1.1,
      house: 1.05,
      townhouse: 1.0,
      apartment: 0.95
    };
    return multipliers[propertyType] || 1.0;
  }

  private getAreaMultiplier(area: number): number {
    if (area < 30) return 0.9;
    if (area < 50) return 1.0;
    if (area < 100) return 1.1;
    return 1.2;
  }

  private getTimeMultiplier(period: string): number {
    const multipliers: Record<string, number> = {
      '3m': 1.02,
      '6m': 1.05,
      '1y': 1.08,
      '2y': 1.15,
      '5y': 1.35
    };
    return multipliers[period] || 1.0;
  }

  private calculateMarketVolatility(indicators: MarketData['marketIndicators']): number {
    const volatilityScore = 
      (Math.abs(indicators.gdpGrowth - 3) * 0.3) +
      (Math.abs(indicators.interestRate - 2.5) * 0.4) +
      (Math.abs(indicators.inflationRate - 2) * 0.3);
    
    return Math.min(volatilityScore / 10, 0.5);
  }

  private calculateTrendFactor(indicators: MarketData['marketIndicators']): number {
    const economicScore = 
      (indicators.gdpGrowth * 0.3) +
      (indicators.populationGrowth * 0.2) +
      (indicators.constructionIndex * 0.3) -
      (indicators.interestRate * 0.2);
    
    return 1 + (economicScore / 100);
  }

  private getSeasonalFactor(): number {
    const month = new Date().getMonth();
    // Thai property market is typically stronger in Q4 and Q1
    const seasonalFactors = [1.05, 1.03, 1.0, 0.98, 0.97, 0.96, 0.98, 1.0, 1.02, 1.03, 1.05, 1.07];
    return seasonalFactors[month];
  }

  private calculateRiskFactor(location: string, propertyType: string): number {
    const locationRisk: Record<string, number> = {
      bangkok: 0.1,
      nonthaburi: 0.15,
      pathum_thani: 0.2,
      samut_prakan: 0.25,
      chiang_mai: 0.3,
      phuket: 0.35
    };

    const propertyRisk: Record<string, number> = {
      condo: 0.2,
      house: 0.15,
      townhouse: 0.18,
      apartment: 0.25
    };

    return (locationRisk[location] || 0.2) + (propertyRisk[propertyType] || 0.2);
  }

  private analyzePriceFactors(data: MarketData) {
    return [
      {
        name: 'Location Premium',
        weight: this.modelWeights.location,
        impact: this.getLocationMultiplier(data.location) > 1 ? 'positive' as const : 'negative' as const
      },
      {
        name: 'Property Type',
        weight: this.modelWeights.propertyType,
        impact: this.getPropertyTypeMultiplier(data.propertyType) > 1 ? 'positive' as const : 'neutral' as const
      },
      {
        name: 'Size Factor',
        weight: this.modelWeights.area,
        impact: this.getAreaMultiplier(data.area) > 1 ? 'positive' as const : 'negative' as const
      },
      {
        name: 'Market Trends',
        weight: this.modelWeights.marketTrends,
        impact: data.marketIndicators.gdpGrowth > 3 ? 'positive' as const : 'neutral' as const
      }
    ];
  }

  private assessRisk(data: MarketData) {
    const riskScore = this.calculateRiskFactor(data.location, data.propertyType);
    const volatility = this.calculateMarketVolatility(data.marketIndicators);
    
    const totalRisk = (riskScore + volatility) / 2;
    
    let level: 'low' | 'medium' | 'high';
    let factors: string[];
    
    if (totalRisk < 0.2) {
      level = 'low';
      factors = ['Stable market conditions', 'Prime location', 'Low volatility'];
    } else if (totalRisk < 0.35) {
      level = 'medium';
      factors = ['Moderate market fluctuations', 'Average location premium', 'Standard volatility'];
    } else {
      level = 'high';
      factors = ['High market volatility', 'Emerging location', 'Economic uncertainty'];
    }

    return { level, factors };
  }

  // Method to retrain model with new data
  public async retrainModel(newData: MarketData[]): Promise<void> {
    // Simulate model retraining
    console.log('Retraining AI model with new data...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Update model weights based on new data
    this.updateModelWeights(newData);
    console.log('Model retrained successfully');
  }

  private updateModelWeights(data: MarketData[]): void {
    // Simulate weight optimization
    const locationAccuracy = this.calculateAccuracy(data, 'location');
    const propertyAccuracy = this.calculateAccuracy(data, 'propertyType');
    const areaAccuracy = this.calculateAccuracy(data, 'area');
    const marketAccuracy = this.calculateAccuracy(data, 'market');

    const total = locationAccuracy + propertyAccuracy + areaAccuracy + marketAccuracy;
    
    this.modelWeights = {
      location: locationAccuracy / total,
      propertyType: propertyAccuracy / total,
      area: areaAccuracy / total,
      marketTrends: marketAccuracy / total
    };
  }

  private calculateAccuracy(data: MarketData[], factor: string): number {
    // Simulate accuracy calculation
    return Math.random() * 0.3 + 0.7; // 70-100% accuracy
  }
}

export default AIModelService;