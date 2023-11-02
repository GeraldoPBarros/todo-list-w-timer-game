import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from "faunadb";
import { fauna } from "../../../services/fauna";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const tag_list = await fauna.query(
      q.Map(
        q.Paginate(q.Documents(q.Collection("tags"))),
        q.Lambda((task) => q.Get(task))
      )
    );
    return res.status(200).json({ tags: tag_list });
  }

  if (req.method === "PUT") {
    const body = req.body;
    let query = await fauna.query(
      q.Create(q.Collection("tags"), {
        data: body,
      })
    );
    res.status(200).json({ data: query });
  }

  if (req.method === "DELETE") {
    const { id } = req.query;
    console.log("ID: ", id);
    let query = await fauna.query(
      q.Delete(q.Ref(q.Collection("tags"), id))
    );
    res.status(200).json({ data: query });
  }
};
