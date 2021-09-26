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

type Data = {
  inventory: typeof data;
};

const GildedRoseApiMiddleware = () => {
  const handler = nextConnect();
  const gildedRose = new GildedRose(
    // data would normally be fetched from a database or something
    data
      .map(({ type, name, sellIn, quality }) => {
        if (ItemType[type]) {
          return itemFactory(type as ItemType, name, sellIn, quality);
        }
      })
      .filter((item) => item !== undefined) as Array<AbstractItem>
  );

  handler.use((req: NextApiRequest, res: NextApiResponse<Data>) => {
    // TODO: use data from GildedRose object
    res.status(200).json({ inventory: data });
  });

  return handler;
};

export default GildedRoseApiMiddleware;
