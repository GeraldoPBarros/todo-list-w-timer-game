import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from "faunadb";
import { fauna } from "../../../services/fauna";

type User = {
  ref: {
    id: string;
  };
  data: {
    stripe_customer_id: string;
  };
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const task_list = await fauna.query(
      q.Map(
        q.Paginate(q.Documents(q.Collection("tasks"))),
        q.Lambda((show) => q.Get(show))
      )
    );
    return res.status(200).json({ tasks: task_list });
  }
  
  if (req.method === "PUT") {
    const body = req.body;
    let query = await fauna.query(
      q.Create(q.Collection("tasks"), {
        data: body,
      })
    );
    res.status(200).json({ data: query });
  }
};
