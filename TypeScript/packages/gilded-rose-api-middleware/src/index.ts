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
import path from "path";

type Data = {
  inventory: typeof data;
};

interface Config {
  absolutePath: string;
  catchAllKey: string;
}

const GildedRoseApiMiddleware = ({ absolutePath, catchAllKey }: Config) => {
  const createPath = (p: string) => path.join(absolutePath, p);

  const getParam = (req: NextApiRequest) => {
    return req.query?.[catchAllKey]?.[0];
  };

  const handler = nextConnect();
  const gildedRose = new GildedRose(
    // data would normally be fetched from a database or something
    data
      .map(({ type, id, name, sellIn, quality, isConjured }) => {
        if (Object.values(ItemType).includes(type as ItemType)) {
          return itemFactory(
            type as ItemType,
            id,
            name,
            sellIn,
            quality,
            isConjured
          );
        }
      })
      .filter((item) => item !== undefined) as Array<AbstractItem>
  );

  handler
    .get(absolutePath, (req: NextApiRequest, res: NextApiResponse<Data>) => {
      res
        .status(200)
        .json({ inventory: gildedRose.items.map((item) => item.toJSON()) });
    })
    .get(
      createPath("/:id"),
      (req: NextApiRequest, res: NextApiResponse<any>) => {
        res.status(200).json({ foo: "bar" });
      }
    )
    .delete(
      createPath("/:id"),
      (req: NextApiRequest, res: NextApiResponse<Data>) => {
        const id = getParam(req);
        if (id) {
          gildedRose.delete(id);
          res
            .status(200)
            .json({ inventory: gildedRose.items.map((item) => item.toJSON()) });
        }
      }
    )
    .post(absolutePath, (req: NextApiRequest, res: NextApiResponse<Data>) => {
      const item = JSON.parse(req.body);
      gildedRose.items.push(
        itemFactory(
          item.type,
          uuid(),
          item.name,
          item.sellIn,
          item.quality,
          item.isConjured
        )
      );
      res
        .status(200)
        .json({ inventory: gildedRose.items.map((item) => item.toJSON()) });
    })
    .post(
      createPath("/:id"),
      (req: NextApiRequest, res: NextApiResponse<AbstractItem>) => {
        const item = gildedRose.getById(getParam(req));
        const newItem: AbstractItem = JSON.parse(req.body);
        if (item && newItem) {
          res.status(200).json(gildedRose.updateItem(item.id, newItem));
        }
      }
    );

  return handler;
};

export default GildedRoseApiMiddleware;
