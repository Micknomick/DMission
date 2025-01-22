import { ResetPasswordParams, UpdatePasswordParams } from "@/lib/type";


export const sendResetPasswordEmail = async (params: ResetPasswordParams) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: params.email,
      redirect_url: `https://dmission-app.vercel.app//newpassword`
    }),
  });
  return response.json();
};

export const updatePassword = async (params: UpdatePasswordParams) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
  return response.json();
};
