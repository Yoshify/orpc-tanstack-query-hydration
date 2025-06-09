class PlanetClass {
    constructor(public id: number, public name: string) { }
}

(globalThis as any).Planet ??= PlanetClass

export const Planet = (globalThis as any).Planet as typeof PlanetClass