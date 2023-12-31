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
    const users = await fauna.query(
      q.Map(
        q.Paginate(q.Documents(q.Collection("users"))),
        q.Lambda((show) => q.Get(show))
      )
    );
    return res.status(200).json({ user: users });
  }
};
