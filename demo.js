export class IntensitySegments {
    constructor() {
        this.segments = new Map();
    }
    add(from, to, amount) {
        this.segments.set(from, (this.segments.get(from) || 0) + amount);
        this.segments.set(to, (this.segments.get(to) || 0) - amount);
    }
    _buildSegments() {
        const keys = Array.from(this.segments.keys()).sort((a, b) => a - b);
        let currentIntensity = 0;
        const result = [];
        let firstNonZeroAdded = false;
        for (const key of keys) {
            currentIntensity += this.segments.get(key);
            if (currentIntensity !== 0 || firstNonZeroAdded) {
                result.push([key, currentIntensity]);
                firstNonZeroAdded = true;
            }
        }
        while (result.length > 1 &&
            result[result.length - 1][1] === 0 &&
            result[result.length - 2][1] === 0) {
            result.pop();
        }
        return result;
    }
    toString() {
        return JSON.stringify(this._buildSegments());
    }
}
