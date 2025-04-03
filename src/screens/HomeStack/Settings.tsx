import { View } from "react-native";

import { useSignout } from "@/api";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { accessTokenName, refreshTokenName } from "@/constants/tokens";
import { useAuthStore } from "@/store";
import { CookieStorage } from "@/store/storage";

export default function Settings() {
  const setIsSignedIn = useAuthStore((state) => state.setIsSignedIn);
  const logoutMutation = useSignout();

  const logout = async () => {
    await logoutMutation.mutateAsync();
    CookieStorage.delete(accessTokenName);
    CookieStorage.delete(refreshTokenName);
    CookieStorage.cleanExpired();
    setIsSignedIn(false);
  };

  return (
    <View>
      <Button onPress={logout}>
        <Text>Logout</Text>
      </Button>
    </View>
  );
}
