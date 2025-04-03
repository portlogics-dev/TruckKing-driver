import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Dayjs } from "dayjs";
import { Suspense, useCallback, useEffect } from "react";
import { ScrollView, View } from "react-native";
import ErrorBoundary, {
  FallbackComponentProps,
} from "react-native-error-boundary";

import { useCurrentOrderDetail } from "@/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { useI18n } from "@/i18n";
import { CameraIcon, GhostIcon, PhoneIcon, RotateCcwIcon } from "@/lib/icons";
import { cn } from "@/lib/utils/cn";
import { HomeStackScreenProps, OrderStatus } from "@/type";

type OrderDetail = {
  id: number;
  company: {
    id: number;
    name: string;
  };
  loading: {
    address: string;
    addressDetail: string;
    latitude: number;
    longitude: number;
    expectTime: Dayjs;
  };
  unloading: {
    address: string;
    addressDetail: string;
    latitude: number;
    longitude: number;
    expectTime: Dayjs;
  };
  weight: {
    value: number;
    unit: string;
  };
  price: {
    value: number;
    currency: string;
  };
  status: OrderStatus;
  transitSteps: Array<{
    orderId: number;
    stepEvent: string;
    stepEventName: string;
    stepEventImageUrl: string;
    latitude: number;
    longitude: number;
    createdAt: Dayjs;
  }>;
  tracks: Array<{
    id: number;
    latitude: number;
    longitude: number;
    trackingTime: Dayjs;
  }>;
};

function HomeFallback({ error, resetError }: FallbackComponentProps) {
  const { t } = useI18n();
  // todo: 인앱 전화 연결
  return (
    <View className="grow bg-card dark:bg-background-dark px-6">
      <View className="grow gap-4 justify-center">
        <View className="flex items-center gap-8">
          <View className="flex items-center gap-4">
            <GhostIcon size={64} />
            <Text className="text-2xl font-bold">{t("Order not found")}</Text>
            <Text className="rounded p-4 bg-muted text-muted-foreground break-keep">
              {error.message}
            </Text>
          </View>
          <Button
            onPress={resetError}
            className="flex-row gap-2"
            variant="destructive"
          >
            <Text>{t("Retry")}</Text>
            <RotateCcwIcon size={16} className="text-white" />
          </Button>
        </View>
      </View>
      <View className="gap-4 justify-center py-8">
        <View className="flex items-center gap-4">
          <Button className="flex-row gap-2">
            <Text>{t("Contact")}</Text>
            <PhoneIcon size={16} className="text-white" />
          </Button>
        </View>
      </View>
    </View>
  );
}

function HomeLoading() {
  return (
    <View className="grow gap-4 justify-center px-6">
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
    </View>
  );
}

export function OrderDetailHeader({
  orderId,
  status,
}: {
  orderId: OrderDetail["id"];
  status: OrderDetail["status"];
}) {
  const { t } = useI18n();

  const statusBadgeColor = () => {
    switch (status) {
      case OrderStatus.COMPLETED:
        return "bg-lime-500";
      case OrderStatus.CANCELLED:
        return "bg-red-500";
      case OrderStatus.PENDING:
        return "bg-gray-500";
      default:
        return "bg-sky-500";
    }
  };
  return (
    <View
      className={cn(
        "gap-4 items-baseline justify-start p-6",
        statusBadgeColor()
      )}
    >
      <Text className="text-2xl font-bold">
        {t("Order ID")}: {orderId ?? "-"}
      </Text>
      <View className="flex-row gap-2 items-center">
        <Text className="text-muted-foreground">{status}</Text>
        {/* <View
          className={cn(
            "size-4 rounded-full border border-muted",
            
          )}
        /> */}
      </View>
    </View>
  );
}

function OrderStep(step: OrderDetail["transitSteps"][number]) {
  return (
    <View className="grow rounded justify-between bg-card dark:bg-card-dark ">
      <Text className="font-bold">{step.stepEventName}</Text>
      <Button variant="ghost">
        <CameraIcon />
      </Button>
    </View>
  );
}

export function Home({ navigation }: HomeStackScreenProps<"Home">) {
  const { t } = useI18n();

  const { data } = useCurrentOrderDetail();

  const fallbackComponent = useCallback(
    (fallbackProps: FallbackComponentProps) => (
      <HomeFallback {...fallbackProps} />
    ),
    []
  );

  const headerTitle = useCallback(
    () => <OrderDetailHeader orderId={data.id} status={data.status} />,
    [data]
  );
  useEffect(() => {
    navigation.setOptions({
      headerTitle,
    });
  }, [navigation, headerTitle]);

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onError={reset} FallbackComponent={fallbackComponent}>
          <Suspense fallback={<HomeLoading />}>
            <View className="grow bg-background dark:bg-background-dark">
              <OrderDetailHeader orderId={data.id} status={data.status} />
              <ScrollView className="grow px-6">
                <View className="grow gap-4">
                  {data.transitSteps.map((step) => (
                    <OrderStep {...step} />
                  ))}
                </View>
                <View className="grow gap-4">
                  <Text className="text-muted-foreground text-xl font-bold">
                    {t("Loading")}
                  </Text>
                  <Card>
                    <Card.Content>
                      <View className="grow flex-row justify-between gap-16">
                        <Text className="font-semibold text-muted-foreground">
                          {t("Point")}
                        </Text>
                        <View>
                          <Text>{data.loading.address}</Text>
                          <Text className="text-sm">
                            {data.loading.addressDetail}
                          </Text>
                        </View>
                      </View>
                      <View className="grow flex-row justify-between">
                        <Text className="font-semibold text-muted-foreground">
                          {t("ETA")}
                        </Text>
                        <Text>
                          {data.loading.expectTime.format("YYYY-MM-DD HH:mm")}
                        </Text>
                      </View>
                    </Card.Content>
                  </Card>
                  <Card>
                    <Card.Header>
                      <Card.Title className="text-xl font-bold">
                        {t("Unloading")}
                      </Card.Title>
                    </Card.Header>
                    <Card.Content>
                      <View className="grow justify-between">
                        <Text className="font-semibold">{t("Point")}</Text>
                        <View>
                          <Text>{data.unloading.address}</Text>
                          <Text className="text-sm text-muted-foreground">
                            {data.unloading.addressDetail}
                          </Text>
                        </View>
                      </View>
                      <View className="grow justify-between">
                        <Text className="font-semibold">{t("ETA")}</Text>
                        <Text>
                          {data.unloading.expectTime.format("YYYY-MM-DD HH:mm")}
                        </Text>
                      </View>
                    </Card.Content>
                  </Card>
                  <Card>
                    <Card.Header>
                      <Card.Title>{t("Details")}</Card.Title>
                    </Card.Header>
                    <Card.Content>
                      <View className="grow justify-between">
                        <Text className="font-semibold">{t("Weight")}</Text>
                        <Text>
                          {data.weight.value} {data.weight.unit}
                        </Text>
                      </View>
                      <View className="grow justify-between">
                        <Text className="font-semibold">{t("Price")}</Text>
                        <Text>
                          {data.price.value} {data.price.currency}
                        </Text>
                      </View>
                    </Card.Content>
                  </Card>
                </View>
              </ScrollView>
            </View>
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
