'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  convertMinutesToHoursAndMinutes,
  roundToNearestQuarter,
} from '@/lib/helpers';
import { Separator } from '@/components/ui/separator';

const START_TIME_DEFAULT = '08:00';
const END_TIME_DEFAULT = new Date().toLocaleTimeString('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

export default function MovingTimeCalculator(): React.ReactElement {
  const [startTime, setStartTime] = useState<string>(START_TIME_DEFAULT);
  const [endTime, setEndTime] = useState<string>(END_TIME_DEFAULT);

  const [timeOff, setTimeOff] = useState<string>('0');
  const [travelTime, setTravelTime] = useState<string>('60');
  const [cashDiscount, setCashDiscount] = useState<string>('0');
  const [hourlyRate, setHourlyRate] = useState<string>('0');
  const [laborTime, setLaborTime] = useState<number>(0);
  const [totalTimeReal, setTotalTimeReal] = useState<number>(0);
  const [totalTimeRounded, setTotalTimeRounded] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCalculated, setIsCalculated] = useState<boolean>(false);

  const calculateTotal = (): void => {
    const start: Date = new Date(`2000-01-01T${startTime}:00`);
    let end: Date = new Date(`2000-01-01T${endTime}:00`);

    if (end < start) {
      end = new Date(`2000-01-02T${endTime}:00`);
    }

    let diffMinutes: number = (end.getTime() - start.getTime()) / 1000 / 60; // difference in minutes
    const timeOffMinutes: number = Number.parseFloat(timeOff);
    const travelTimeMinutes: number = Number.parseFloat(travelTime);

    setLaborTime(diffMinutes);

    diffMinutes -= timeOffMinutes; // subtract time off
    diffMinutes += travelTimeMinutes; // add travel time

    setTotalTimeReal(diffMinutes);

    const totalHoursRounded: number = roundToNearestQuarter(diffMinutes);

    setTotalTimeRounded(totalHoursRounded);

    setIsCalculated(true);
  };

  function resetCalculator(): void {
    setStartTime(START_TIME_DEFAULT);
    setEndTime(END_TIME_DEFAULT);
    setIsCalculated(false);
    setTotalTimeRounded(0);
    setTotalTimeReal(0);
    setCustomAmount('0');
    setCashDiscount('0');
    setHourlyRate('0');
    setTravelTime('0');
    setTimeOff('0');
    setLaborTime(0);
    setIsCalculated(false);
    setTotalTimeRounded(0);
    setTotalTimeReal(0);
  }

  const formattedLaborTime = convertMinutesToHoursAndMinutes(laborTime);

  const formattedTotalTimeRounded =
    convertMinutesToHoursAndMinutes(totalTimeRounded);

  const formattedTravelTime = convertMinutesToHoursAndMinutes(
    Number(travelTime)
  );
  const formattedTimeOff = convertMinutesToHoursAndMinutes(Number(timeOff));
  const formattedTotalTimeReal = convertMinutesToHoursAndMinutes(totalTimeReal);

  const totalAmount = (totalTimeRounded / 60) * Number(hourlyRate);

  const cashDiscountAmount =
    Number(customAmount) * (Number(cashDiscount) / 100);

  const totalAmountWithCustomAmount = Number(customAmount) - cashDiscountAmount;

  useEffect(() => {
    setCustomAmount(totalAmount.toString());
  }, [totalAmount]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Moving Time Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="start-time">Start Time</Label>
              <Input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setStartTime(e.target.value);
                  setIsCalculated(false);
                }}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="end-time">End Time</Label>
              <Input
                id="end-time"
                type="time"
                value={endTime}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setEndTime(e.target.value);
                  setIsCalculated(false);
                }}
              />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="travel-time">Travel Time (minutes)</Label>
            <Input
              id="travel-time"
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              value={travelTime}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setTravelTime(e.target.value);
                setIsCalculated(false);
              }}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="time-off">Time Off (minutes)</Label>
            <Input
              id="time-off"
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              value={timeOff}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setTimeOff(e.target.value);
                setIsCalculated(false);
              }}
            />
          </div>
          <Button onClick={calculateTotal} size="lg" className="w-full">
            Calculate
          </Button>

          {isCalculated && (
            <>
              <Separator />
              <TimeSection
                formattedLaborTime={formattedLaborTime}
                travelTime={formattedTravelTime}
                timeOff={formattedTimeOff}
                formattedTotalTimeReal={formattedTotalTimeReal}
                formattedTotalTimeRounded={formattedTotalTimeRounded}
              />

              <Separator />
              <div className="relative">
                <Label htmlFor="hourly-rate">Rate ($)</Label>
                <Input
                  id="hourly-rate"
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={hourlyRate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setHourlyRate(e.target.value);
                  }}
                />
              </div>
              <div className="grid grid-cols-8 gap-4 items-center text-center py-4">
                <p className="col-span-2">
                  {(totalTimeRounded / 60).toFixed(2)}
                </p>
                <span>x</span>
                <p className="col-span-2">${Number(hourlyRate).toFixed(2)}</p>
                <span>=</span>
                <p className="col-span-2">${totalAmount.toFixed(2)}</p>
              </div>
              <Separator />
              <div className="relative col-span-2">
                <Label htmlFor="cash-discount">Cash Discount (%)</Label>
                <Input
                  id="cash-discount"
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={cashDiscount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value;
                    if (value.length > 3) return;
                    setCashDiscount(value);
                  }}
                />
              </div>
              <div className="grid grid-cols-9 gap-4 items-center text-center py-4">
                <Input
                  id="custom-amount"
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={customAmount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCustomAmount(e.target.value)
                  }
                  className="col-span-3"
                />
                <span>-</span>
                <p className="col-span-2">${cashDiscountAmount.toFixed(2)}</p>
                <span>=</span>
                <p className="col-span-2">
                  ${totalAmountWithCustomAmount.toFixed(2)}
                </p>
              </div>
              <Separator />
              <div className="flex justify-end">
                <Button variant="outline" onClick={resetCalculator}>
                  Reset
                </Button>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface TimeSectionProps {
  formattedLaborTime: string;
  travelTime: string;
  timeOff: string;
  formattedTotalTimeReal: string;
  formattedTotalTimeRounded: string;
}

function TimeSection({
  formattedLaborTime,
  travelTime,
  timeOff,
  formattedTotalTimeReal,
  formattedTotalTimeRounded,
}: TimeSectionProps): React.ReactElement {
  console.log(timeOff);
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <p>Labor time</p>
        <p>{formattedLaborTime}</p>
      </div>
      <div className="flex justify-between">
        <p>Travel time</p>
        <p>{travelTime}</p>
      </div>
      {timeOff && (
        <div className="flex justify-between">
          <p>Time off</p>
          <p>{timeOff}</p>
        </div>
      )}
      <div className="flex justify-between">
        <p>Total time</p>
        <p>{formattedTotalTimeReal}</p>
      </div>
      <div className="flex justify-between font-bold">
        <p>Total time rounded</p>
        <p>{formattedTotalTimeRounded}</p>
      </div>
    </div>
  );
}
