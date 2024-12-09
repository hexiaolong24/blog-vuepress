export class IntensitySegments {
    private segments: [number, number][] = [];

    add(from: number, to: number, amount: number) {
        if (from >= to) return;

        this.updateSegment(from, amount);
        this.updateSegment(to, -amount);
        this.mergeSegments();
    }

    private updateSegment(point: number, amount: number) {
        const index = this.segments.findIndex(([p]) => p === point);
        if (index >= 0) {
            this.segments[index][1] += amount;
            if (this.segments[index][1] === 0) {
                this.segments.splice(index, 1);
            }
        } else {
            this.segments.push([point, amount]);
        }
    }

    private mergeSegments() {
        this.segments.sort(([a], [b]) => a - b);

        const merged: [number, number][] = [];
        let currentIntensity = 0;

        for (const [point, intensity] of this.segments) {
            currentIntensity += intensity;
            if (merged.length === 0 || merged[merged.length - 1][1] !== currentIntensity) {
                merged.push([point, currentIntensity]);
            }
        }

        this.segments = merged;
    }

    toString() {
        return JSON.stringify(this.segments);
    }
}

// 测试用例
const segments = new IntensitySegments();
console.log(segments.toString()); // 输出 "[]"
segments.add(10, 30, 1);
console.log(segments.toString()); // 输出: "[[10,1],[30,0]]"
segments.add(20, 40, 1);
console.log(segments.toString()); // 输出: "[[10,1],[20,2],[30,1],[40,0]]"
segments.add(10, 40, -2);
console.log(segments.toString()); // 输出: "[[10,-1],[20,0],[30,-1],[40,0]]"


