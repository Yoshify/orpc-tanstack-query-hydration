import { Planet } from "@/schemas/planet-class";
import { StandardRPCCustomJsonSerializer, StandardRPCJsonSerializer } from "@orpc/client/standard";

export const PlanetSerializer: StandardRPCCustomJsonSerializer = {
    type: 21,
    condition: (data) => data instanceof Planet,
    serialize: (data) => ({ id: data.id, name: data.name }),
    deserialize: (data) => new Planet(data.id, data.name),
}

const ORPCSerializer = new StandardRPCJsonSerializer({
  customJsonSerializers: [PlanetSerializer],
});

export const serialize = (data: any) => {
  const [json, meta] = ORPCSerializer.serialize(data);
  return { json, meta };
};

export const deserialize = (data: any) => {
  return ORPCSerializer.deserialize(data.json, data.meta);
};