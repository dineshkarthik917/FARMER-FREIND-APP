import { CropPriceHistory, MandiPriceItem } from '../types';

export interface CropMandiConfig {
  cropKey: string;
  nameEn: string;
  nameTa: string;
  mandis: {
    id: string;
    mandiName: string;
    mandiNameTa: string;
    distanceKm: number;
    pricePerKg: number;
    yesterdayPrice: number;
    baseTransportCost: number;
    updatedAt: string;
  }[];
  history: CropPriceHistory[];
}

export const CROPS_DATA: Record<string, CropMandiConfig> = {
  tomato: {
    cropKey: 'tomato',
    nameEn: 'Tomato',
    nameTa: 'தக்காளி',
    mandis: [
      {
        id: 'local',
        mandiName: 'Local Mandi',
        mandiNameTa: 'உள்ளூர் உழவர் சந்தை',
        distanceKm: 8,
        pricePerKg: 20,
        yesterdayPrice: 20,
        baseTransportCost: 200,
        updatedAt: '10:30 AM'
      },
      {
        id: 'city',
        mandiName: 'Nearby City Mandi',
        mandiNameTa: 'அருகிலுள்ள நகர சந்தை',
        distanceKm: 28,
        pricePerKg: 24,
        yesterdayPrice: 22,
        baseTransportCost: 650,
        updatedAt: '10:30 AM'
      },
      {
        id: 'district',
        mandiName: 'District Mandi',
        mandiNameTa: 'மாவட்ட மொத்த சந்தை',
        distanceKm: 18,
        pricePerKg: 23,
        yesterdayPrice: 21,
        baseTransportCost: 350,
        updatedAt: '10:30 AM'
      }
    ],
    history: [
      { day: 'Day 1', dayTa: 'நாள் 1', price: 19, date: 'Oct 02' },
      { day: 'Day 2', dayTa: 'நாள் 2', price: 20, date: 'Oct 03' },
      { day: 'Day 3', dayTa: 'நாள் 3', price: 21, date: 'Oct 04' },
      { day: 'Day 4', dayTa: 'நாள் 4', price: 20, date: 'Oct 05' },
      { day: 'Day 5', dayTa: 'நாள் 5', price: 22, date: 'Oct 06' },
      { day: 'Day 6', dayTa: 'நாள் 6', price: 22, date: 'Oct 07' },
      { day: 'Today', dayTa: 'இன்று', price: 24, date: 'Oct 08' }
    ]
  },
  paddy: {
    cropKey: 'paddy',
    nameEn: 'Paddy',
    nameTa: 'நெல்',
    mandis: [
      {
        id: 'local',
        mandiName: 'Local Mandi',
        mandiNameTa: 'உள்ளூர் உழவர் சந்தை',
        distanceKm: 8,
        pricePerKg: 22,
        yesterdayPrice: 22,
        baseTransportCost: 300,
        updatedAt: '10:30 AM'
      },
      {
        id: 'city',
        mandiName: 'Nearby City Mandi',
        mandiNameTa: 'அருகிலுள்ள நகர சந்தை',
        distanceKm: 28,
        pricePerKg: 25,
        yesterdayPrice: 24,
        baseTransportCost: 700,
        updatedAt: '10:30 AM'
      },
      {
        id: 'district',
        mandiName: 'District Mandi',
        mandiNameTa: 'மாவட்ட மொத்த சந்தை',
        distanceKm: 18,
        pricePerKg: 24,
        yesterdayPrice: 23,
        baseTransportCost: 450,
        updatedAt: '10:30 AM'
      }
    ],
    history: [
      { day: 'Day 1', dayTa: 'நாள் 1', price: 22, date: 'Oct 02' },
      { day: 'Day 2', dayTa: 'நாள் 2', price: 22, date: 'Oct 03' },
      { day: 'Day 3', dayTa: 'நாள் 3', price: 23, date: 'Oct 04' },
      { day: 'Day 4', dayTa: 'நாள் 4', price: 23, date: 'Oct 05' },
      { day: 'Day 5', dayTa: 'நாள் 5', price: 24, date: 'Oct 06' },
      { day: 'Day 6', dayTa: 'நாள் 6', price: 24, date: 'Oct 07' },
      { day: 'Today', dayTa: 'இன்று', price: 25, date: 'Oct 08' }
    ]
  },
  onion: {
    cropKey: 'onion',
    nameEn: 'Onion',
    nameTa: 'வெங்காயம்',
    mandis: [
      {
        id: 'local',
        mandiName: 'Local Mandi',
        mandiNameTa: 'உள்ளூர் உழவர் சந்தை',
        distanceKm: 8,
        pricePerKg: 28,
        yesterdayPrice: 27,
        baseTransportCost: 200,
        updatedAt: '10:30 AM'
      },
      {
        id: 'city',
        mandiName: 'Nearby City Mandi',
        mandiNameTa: 'அருகிலுள்ள நகர சந்தை',
        distanceKm: 28,
        pricePerKg: 34,
        yesterdayPrice: 31,
        baseTransportCost: 600,
        updatedAt: '10:30 AM'
      },
      {
        id: 'district',
        mandiName: 'District Mandi',
        mandiNameTa: 'மாவட்ட மொத்த சந்தை',
        distanceKm: 18,
        pricePerKg: 32,
        yesterdayPrice: 30,
        baseTransportCost: 380,
        updatedAt: '10:30 AM'
      }
    ],
    history: [
      { day: 'Day 1', dayTa: 'நாள் 1', price: 26, date: 'Oct 02' },
      { day: 'Day 2', dayTa: 'நாள் 2', price: 27, date: 'Oct 03' },
      { day: 'Day 3', dayTa: 'நாள் 3', price: 29, date: 'Oct 04' },
      { day: 'Day 4', dayTa: 'நாள் 4', price: 28, date: 'Oct 05' },
      { day: 'Day 5', dayTa: 'நாள் 5', price: 30, date: 'Oct 06' },
      { day: 'Day 6', dayTa: 'நாள் 6', price: 31, date: 'Oct 07' },
      { day: 'Today', dayTa: 'இன்று', price: 34, date: 'Oct 08' }
    ]
  },
  chilli: {
    cropKey: 'chilli',
    nameEn: 'Chilli',
    nameTa: 'மிளகாய்',
    mandis: [
      {
        id: 'local',
        mandiName: 'Local Mandi',
        mandiNameTa: 'உள்ளூர் உழவர் சந்தை',
        distanceKm: 8,
        pricePerKg: 42,
        yesterdayPrice: 40,
        baseTransportCost: 180,
        updatedAt: '10:30 AM'
      },
      {
        id: 'city',
        mandiName: 'Nearby City Mandi',
        mandiNameTa: 'அருகிலுள்ள நகர சந்தை',
        distanceKm: 28,
        pricePerKg: 49,
        yesterdayPrice: 46,
        baseTransportCost: 550,
        updatedAt: '10:30 AM'
      },
      {
        id: 'district',
        mandiName: 'District Mandi',
        mandiNameTa: 'மாவட்ட மொத்த சந்தை',
        distanceKm: 18,
        pricePerKg: 47,
        yesterdayPrice: 45,
        baseTransportCost: 320,
        updatedAt: '10:30 AM'
      }
    ],
    history: [
      { day: 'Day 1', dayTa: 'நாள் 1', price: 38, date: 'Oct 02' },
      { day: 'Day 2', dayTa: 'நாள் 2', price: 40, date: 'Oct 03' },
      { day: 'Day 3', dayTa: 'நாள் 3', price: 41, date: 'Oct 04' },
      { day: 'Day 4', dayTa: 'நாள் 4', price: 43, date: 'Oct 05' },
      { day: 'Day 5', dayTa: 'நாள் 5', price: 44, date: 'Oct 06' },
      { day: 'Day 6', dayTa: 'நாள் 6', price: 46, date: 'Oct 07' },
      { day: 'Today', dayTa: 'இன்று', price: 49, date: 'Oct 08' }
    ]
  },
  banana: {
    cropKey: 'banana',
    nameEn: 'Banana',
    nameTa: 'வாழை',
    mandis: [
      {
        id: 'local',
        mandiName: 'Local Mandi',
        mandiNameTa: 'உள்ளூர் உழவர் சந்தை',
        distanceKm: 8,
        pricePerKg: 18,
        yesterdayPrice: 17,
        baseTransportCost: 250,
        updatedAt: '10:30 AM'
      },
      {
        id: 'city',
        mandiName: 'Nearby City Mandi',
        mandiNameTa: 'அருகிலுள்ள நகர சந்தை',
        distanceKm: 28,
        pricePerKg: 22,
        yesterdayPrice: 20,
        baseTransportCost: 750,
        updatedAt: '10:30 AM'
      },
      {
        id: 'district',
        mandiName: 'District Mandi',
        mandiNameTa: 'மாவட்ட மொத்த சந்தை',
        distanceKm: 18,
        pricePerKg: 21,
        yesterdayPrice: 19,
        baseTransportCost: 400,
        updatedAt: '10:30 AM'
      }
    ],
    history: [
      { day: 'Day 1', dayTa: 'நாள் 1', price: 17, date: 'Oct 02' },
      { day: 'Day 2', dayTa: 'நாள் 2', price: 18, date: 'Oct 03' },
      { day: 'Day 3', dayTa: 'நாள் 3', price: 18, date: 'Oct 04' },
      { day: 'Day 4', dayTa: 'நாள் 4', price: 19, date: 'Oct 05' },
      { day: 'Day 5', dayTa: 'நாள் 5', price: 20, date: 'Oct 06' },
      { day: 'Day 6', dayTa: 'நாள் 6', price: 20, date: 'Oct 07' },
      { day: 'Today', dayTa: 'இன்று', price: 22, date: 'Oct 08' }
    ]
  },
  cotton: {
    cropKey: 'cotton',
    nameEn: 'Cotton',
    nameTa: 'பருத்தி',
    mandis: [
      {
        id: 'local',
        mandiName: 'Local Mandi',
        mandiNameTa: 'உள்ளூர் உழவர் சந்தை',
        distanceKm: 8,
        pricePerKg: 65,
        yesterdayPrice: 65,
        baseTransportCost: 300,
        updatedAt: '10:30 AM'
      },
      {
        id: 'city',
        mandiName: 'Nearby City Mandi',
        mandiNameTa: 'அருகிலுள்ள நகர சந்தை',
        distanceKm: 28,
        pricePerKg: 73,
        yesterdayPrice: 71,
        baseTransportCost: 800,
        updatedAt: '10:30 AM'
      },
      {
        id: 'district',
        mandiName: 'District Mandi',
        mandiNameTa: 'மாவட்ட மொத்த சந்தை',
        distanceKm: 18,
        pricePerKg: 71,
        yesterdayPrice: 69,
        baseTransportCost: 500,
        updatedAt: '10:30 AM'
      }
    ],
    history: [
      { day: 'Day 1', dayTa: 'நாள் 1', price: 63, date: 'Oct 02' },
      { day: 'Day 2', dayTa: 'நாள் 2', price: 64, date: 'Oct 03' },
      { day: 'Day 3', dayTa: 'நாள் 3', price: 66, date: 'Oct 04' },
      { day: 'Day 4', dayTa: 'நாள் 4', price: 67, date: 'Oct 05' },
      { day: 'Day 5', dayTa: 'நாள் 5', price: 69, date: 'Oct 06' },
      { day: 'Day 6', dayTa: 'நாள் 6', price: 71, date: 'Oct 07' },
      { day: 'Today', dayTa: 'இன்று', price: 73, date: 'Oct 08' }
    ]
  }
};

export interface MarketCalculationResult {
  mandiId: string;
  mandiName: string;
  mandiNameTa: string;
  distanceKm: number;
  pricePerKg: number;
  grossIncome: number;
  transportCost: number;
  netProfit: number;
  isBest: boolean;
}

export function calculateMandiProfits(
  cropKey: string,
  quantityKg: number,
  transportCostAdjustment: number = 0
): {
  results: MarketCalculationResult[];
  bestMarket: MarketCalculationResult;
  profitDeltaOverLocal: number;
} {
  const crop = CROPS_DATA[cropKey] || CROPS_DATA.tomato;
  
  const results: MarketCalculationResult[] = crop.mandis.map((mandi) => {
    const grossIncome = quantityKg * mandi.pricePerKg;
    // Base transport cost + optional custom adjustment
    const finalTransport = Math.max(0, mandi.baseTransportCost + transportCostAdjustment);
    const netProfit = grossIncome - finalTransport;

    return {
      mandiId: mandi.id,
      mandiName: mandi.mandiName,
      mandiNameTa: mandi.mandiNameTa,
      distanceKm: mandi.distanceKm,
      pricePerKg: mandi.pricePerKg,
      grossIncome,
      transportCost: finalTransport,
      netProfit,
      isBest: false
    };
  });

  // Find maximum net profit
  let best = results[0];
  for (const item of results) {
    if (item.netProfit > best.netProfit) {
      best = item;
    }
  }

  // Mark best
  results.forEach((r) => {
    if (r.mandiId === best.mandiId) {
      r.isBest = true;
    }
  });

  const localMandi = results.find((r) => r.mandiId === 'local') || results[0];
  const profitDeltaOverLocal = Math.max(0, best.netProfit - localMandi.netProfit);

  return {
    results,
    bestMarket: best,
    profitDeltaOverLocal
  };
}
