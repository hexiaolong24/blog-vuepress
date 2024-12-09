export class IntensitySegments {
  private segments: Map<number, number>;
  constructor() {
    this.segments = new Map();
  }

  add(from: number, to: number, amount: number): void {
    this.segments.set(from, (this.segments.get(from) || 0) + amount);
    this.segments.set(to, (this.segments.get(to) || 0) - amount);
  }

  private _buildSegments(): [number, number][] {
    const keys: number[] = Array.from(this.segments.keys()).sort(
      (a, b) => a - b
    );
    let currentIntensity = 0;
    const result: [number, number][] = [];
    let firstNonZeroAdded = false;

    for (const key of keys) {
      currentIntensity += this.segments.get(key)!;
      if (currentIntensity !== 0 || firstNonZeroAdded) {
        result.push([key, currentIntensity]);
        firstNonZeroAdded = true;
      }
    }

    while (
      result.length > 1 &&
      result[result.length - 1][1] === 0 &&
      result[result.length - 2][1] === 0
    ) {
      result.pop();
    }

    return result;
  }

  toString(): string {
    return JSON.stringify(this._buildSegments());
  }
}
