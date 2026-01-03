'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import axios from 'axios';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { NumberInput } from '@/components/ui/number-input';

interface DistanceData {
  distanceText: string;
  durationText: string;
  originAddress: string;
  destinationAddress: string;
}

const laborHoursOptions: number[] = [
  2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
];

export const MovingPriceCalculator = () => {
  const [originZip, setOriginZip] = useState<string | number>('');
  const [destinationZip, setDestinationZip] = useState<string | number>('');
  const [laborTime, setLaborTime] = useState<number>(2);
  const [hourlyRate, setHourlyRate] = useState<string | number>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [distanceData, setDistanceData] = useState<DistanceData | null>(null);
  const [lodgingCost, setLodgingCost] = useState<string | number>(0);
  const [truckFuelCostPerMile, setTruckFuelCostPerMile] = useState<
    string | number
  >(0.6);
  const [marginLow, setMarginLow] = useState<string | number>(20);
  const [marginHigh, setMarginHigh] = useState<string | number>(30);

  const [drivingLaborCost, setDrivingLaborCost] = useState<number>(0);
  const [movingLaborCost, setMovingLaborCost] = useState<number>(0);
  const [truckFuelCost, setTruckFuelCost] = useState<number>(0);
  const [totalPriceLow, setTotalPriceLow] = useState<number | null>(null);
  const [totalPriceHigh, setTotalPriceHigh] = useState<number | null>(null);
  const [isCalculated, setIsCalculated] = useState<boolean>(false);

  const formatCurrency = (amount: number) => {
    return `$${Math.round(amount).toLocaleString()}`;
  };

  const calculatePrice = async () => {
    if (!originZip || !destinationZip || !laborTime || !hourlyRate) return;

    setLoading(true);
    setError(null);
    setDistanceData(null);

    try {
      const response = await axios.get('/api/distance', {
        params: {
          origin: originZip,
          destination: destinationZip,
        },
      });

      console.log(response.data);

      const data = response.data;
      if (data.status !== 'OK' || data.rows[0].elements[0].status !== 'OK') {
        throw new Error('Unable to calculate distance.');
      }

      const distanceInMiles = data.rows[0].elements[0].distance.value / 1609.34;
      const drivingTimeHours = data.rows[0].elements[0].duration.value / 3600;

      setDistanceData({
        distanceText: data.rows[0].elements[0].distance.text,
        durationText: data.rows[0].elements[0].duration.text,
        originAddress: data.origin_addresses[0],
        destinationAddress: data.destination_addresses[0],
      });

      const roundTripDrivingHours = drivingTimeHours * 2;

      const movingLabor = Number(hourlyRate) * laborTime;
      const drivingLabor = Number(hourlyRate) * roundTripDrivingHours;
      const fuelCost = distanceInMiles * 2 * Number(truckFuelCostPerMile);

      setMovingLaborCost(movingLabor);
      setDrivingLaborCost(drivingLabor);
      setTruckFuelCost(fuelCost);

      const rawCost =
        movingLabor + drivingLabor + fuelCost + Number(lodgingCost);
      const finalPriceLow = rawCost * (1 + Number(marginLow) / 100);
      const finalPriceHigh = rawCost * (1 + Number(marginHigh) / 100);

      setTotalPriceLow(Math.round(finalPriceLow));
      setTotalPriceHigh(Math.round(finalPriceHigh));
      setIsCalculated(true);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch distance. Please check zipcodes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Long Distance Price Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="origin-zip">Origin Zipcode</Label>
            <NumberInput
              id="origin-zip"
              type="text"
              pattern="\d{5}"
              maxLength={5}
              value={originZip}
              setValue={setOriginZip}
              placeholder="01234"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="destination-zip">Destination Zipcode</Label>
            <NumberInput
              id="destination-zip"
              type="text"
              pattern="\d{5}"
              maxLength={5}
              value={destinationZip}
              setValue={setDestinationZip}
              placeholder="01234"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="labor-time">Loading/Unloading Labor Hours</Label>
            <Select
              onValueChange={(value) => setLaborTime(parseInt(value))}
              value={laborTime.toString()}
            >
              <SelectTrigger className="w-full" id="labor-time">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {laborHoursOptions.map((option, i) => (
                  <SelectItem key={i} value={option.toString()}>
                    {option} hours
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="lodging-cost">Lodging Cost ($)</Label>
            <NumberInput
              id="lodging-cost"
              value={lodgingCost}
              setValue={setLodgingCost}
              placeholder="300"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="truck-fuel-cost-per-mile">
              Truck Fuel Cost Per Mile ($)
            </Label>
            <NumberInput
              id="truck-fuel-cost-per-mile"
              value={truckFuelCostPerMile}
              setValue={setTruckFuelCostPerMile}
              placeholder="0.8"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="margin-low">Margin Low (%)</Label>
              <NumberInput
                id="margin-low"
                value={marginLow}
                setValue={setMarginLow}
                placeholder="20"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="margin-high">Margin High (%)</Label>
              <NumberInput
                id="margin-high"
                value={marginHigh}
                setValue={setMarginHigh}
                placeholder="30"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="hourly-rate">Hourly Rate ($)</Label>
            <NumberInput
              id="hourly-rate"
              value={hourlyRate}
              setValue={setHourlyRate}
              placeholder="159"
            />
          </div>

          <Button
            onClick={calculatePrice}
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Calculating...' : 'Calculate Flat Price'}
          </Button>

          {error && <p className="text-center text-red-500">{error}</p>}

          {isCalculated && distanceData && (
            <div className="space-y-2">
              <h3 className="text-lg font-bold">Trip Details</h3>
              <p>From: {distanceData.originAddress}</p>
              <p>To: {distanceData.destinationAddress}</p>
              <p>Distance: {distanceData.distanceText}</p>
              <p>Estimated Driving Time: {distanceData.durationText}</p>
            </div>
          )}

          {isCalculated && <Separator />}

          {isCalculated &&
            totalPriceLow !== null &&
            totalPriceHigh !== null && (
              <div className="space-y-2">
                <h3 className="text-lg font-bold">Cost Breakdown</h3>
                <div className="space-y-2">
                  <p>Driving labor: ~{formatCurrency(drivingLaborCost)}</p>
                  <p>Moving labor: ~{formatCurrency(movingLaborCost)}</p>
                  <p>Truck/fuel/tolls: ~{formatCurrency(truckFuelCost)}</p>
                  <p>Lodging: ~{formatCurrency(Number(lodgingCost))}</p>
                </div>

                <div className="pt-4 text-center">
                  <h3 className="text-lg font-semibold">Total rough cost</h3>
                  <p className="text-3xl font-bold text-green-600">
                    {formatCurrency(totalPriceLow)}–
                    {formatCurrency(totalPriceHigh)}
                  </p>
                </div>
              </div>
            )}
          {isCalculated && (
            <>
              <Separator />
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setOriginZip('');
                    setDestinationZip('');
                    setLaborTime(2);
                    setHourlyRate(159);
                    setLodgingCost(0);
                    setTruckFuelCostPerMile(0.8);
                    setMarginLow(20);
                    setMarginHigh(30);
                    setTotalPriceLow(null);
                    setTotalPriceHigh(null);
                    setDistanceData(null);
                    setError(null);
                    setIsCalculated(false);
                  }}
                >
                  Reset
                </Button>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
