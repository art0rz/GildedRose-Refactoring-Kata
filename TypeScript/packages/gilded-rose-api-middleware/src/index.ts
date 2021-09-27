// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import {
  AbstractItem,
  GildedRose,
  itemFactory,
  ItemType,
} from "gilded-rose-lib";
import data from "./data.json";
import uuid from "./lib/uuid";

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

  handler
    .get((req: NextApiRequest, res: NextApiResponse<Data>) => {
      res
        .status(200)
        .json({ inventory: gildedRose.items.map((item) => item.toJson()) });
    })
    .delete((req: NextApiRequest, res: NextApiResponse<Data>) => {
      const { id } = JSON.parse(req.body);
      gildedRose.delete(id);
      res
        .status(200)
        .json({ inventory: gildedRose.items.map((item) => item.toJson()) });
    })
    .post((req: NextApiRequest, res: NextApiResponse<Data>) => {
      const item = JSON.parse(req.body);
      gildedRose.items.push(
        itemFactory(item.type, uuid(), item.name, item.sellIn, item.quality)
      );
      res
        .status(200)
        .json({ inventory: gildedRose.items.map((item) => item.toJson()) });
    });

  return handler;
};

export default GildedRoseApiMiddleware;
