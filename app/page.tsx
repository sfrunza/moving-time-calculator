import MovingTimeCalculator from '@/components/moving-time-calculator';
import { ModeToggle } from '@/components/mode-toggle';
export default function Home() {
  return (
    <main>
      <div className="flex justify-end p-4">
        <ModeToggle />
      </div>
      <div className="px-4 pb-10 mt-4">
        <MovingTimeCalculator />
      </div>
    </main>
  );
}
