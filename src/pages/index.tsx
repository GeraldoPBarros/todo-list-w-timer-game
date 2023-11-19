import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Flex, Button, Stack } from "@chakra-ui/react";

import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Input } from "../components/Form/Input";
import Logo from "@/components/Header/Logo";
import { useAuth } from "@/context/AuthContext";

type SignInFormData = {
  email: string;
  password: string;
};

const signInFormSchema = yup.object().shape({
  email: yup.string().required("E-mail obrigatório.").email("E-mail inválido"),
  password: yup.string().required("Senha obrigatória."),
});

export default function SigIn() {
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(signInFormSchema),
  });
  const { signIn, user, signOut } = useAuth();
  const { errors } = formState;
  const router = useRouter();

  // useEffect(() => {
  //   signOut();
  // }, []);

  useEffect(() => {
    if (user != null) {
      router.push("/home", { scroll: false });
    }
  }, [user]);

  const handleSignIn: SubmitHandler<SignInFormData> = async (values) => {
    try {
      signIn({ email: values.email, password: values.password });
    } catch (err) {
      console.log(err);
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return (
    <Flex
      w="100vw"
      h="100vh"
      align="center"
      justify="center"
      direction="column"
    >
      <Logo isBig />
      <br />
      <Flex
        as="form"
        width="100%"
        maxWidth={360}
        bg="gray.100"
        p="8"
        borderRadius={8}
        flexDir="column"
        onSubmit={handleSubmit(handleSignIn)}
      >
        <Stack spacing="4">
          <Input
            type="email"
            label="E-mail"
            error={errors.email}
            {...register("email")}
          />
          <Input
            type="password"
            label="Password"
            error={errors.password}
            {...register("password")}
          />
        </Stack>

        <Button
          type="submit"
          mt="6"
          colorScheme="green"
          size="lg"
          isLoading={formState.isSubmitting}
        >
          Login
        </Button>
      </Flex>
    </Flex>
  );
}
