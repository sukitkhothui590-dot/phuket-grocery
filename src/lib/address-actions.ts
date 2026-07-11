import { getAddresses } from "@/lib/api/addresses";
import { useAuthStore } from "@/stores/auth-store";

export async function syncUserAddresses(): Promise<void> {
  const { accessToken, user } = useAuthStore.getState();
  if (!accessToken || !user) {
    return;
  }

  const addresses = await getAddresses(accessToken);
  useAuthStore.getState().updateUser({ addresses });
}
