// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import uuid from "./lib/uuid";
import nextConnect from "next-connect";
import {
  AbstractItem,
  GildedRose,
  itemFactory,
  ItemType,
} from "gilded-rose-lib";
import data from "./data.json";

type Data = {
  inventory: typeof data;
};

const GildedRoseApiMiddleware = () => {
  const handler = nextConnect();
  const gildedRose = new GildedRose(
    // data would normally be fetched from a database or something
    data
      .map(({ type, id, name, sellIn, quality }) => {
        if (Object.values(ItemType).includes(type as ItemType)) {
          return itemFactory(type as ItemType, id, name, sellIn, quality);
        }
      })
      .filter((item) => item !== undefined) as Array<AbstractItem>
  );

  handler.get((req: NextApiRequest, res: NextApiResponse<Data>) => {
    res
      .status(200)
      .json({ inventory: gildedRose.items.map((item) => item.toJson()) });
  });

  handler.post((req: NextApiRequest, res: NextApiResponse<{}>) => {
    const data = JSON.parse(req.body);
    // TODO: better validation
    if (data.name && data.quality && data.sellIn && data.type) {
      const item = itemFactory(
        data.type,
        uuid(),
        data.name,
        data.quality,
        data.sellIn
      );
      gildedRose.add(item);
      res.status(200).json(item.toJson());

      return;
    }
    res.status(500).json({});
  });

  return handler;
};

export default GildedRoseApiMiddleware;
