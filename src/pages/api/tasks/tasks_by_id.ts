import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from "faunadb";
import { fauna } from "../../../services/fauna";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "PUT") {
    const body = req.body;
    let query = await fauna.query(
      q.Update(q.Ref(q.Collection("tasks"), body.idBd), {
        data: body,
      })
    );
    res.status(200).json({ data: query });
  }
};
