import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from "faunadb";
import { fauna } from "../../../services/fauna";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const task_list = await fauna.query(
      q.Map(
        q.Paginate(q.Documents(q.Collection("rewards"))),
        q.Lambda((task) => q.Get(task))
      )
    );
    return res.status(200).json({ tasks: task_list });
  }

  if (req.method === "PUT") {
    const body = req.body;
    let query = await fauna.query(
      q.Create(q.Collection("rewards"), {
        data: body,
      })
    );
    res.status(200).json({ data: query });
  }

  if (req.method === "DELETE") {
    const { id } = req.query;
    let query = await fauna.query(
      q.Delete(q.Ref(q.Collection("rewards"), id))
    );
    res.status(200).json({ data: query });
  }
};
