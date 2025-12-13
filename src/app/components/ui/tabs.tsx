"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "./utils";

type TabsProps = React.ComponentProps<typeof TabsPrimitive.Root> & {
  valuesOrder?: string[];
};

const TabsAnimationContext = React.createContext<{
  currentValue: string;
  previousValue?: string;
  direction: number;
}>({
  currentValue: "",
  previousValue: undefined,
  direction: 1,
});

function Tabs({
  className,
  defaultValue,
  value: valueProp,
  onValueChange,
  valuesOrder,
  children,
  ...props
}: TabsProps) {
  const [internalValue, setInternalValue] = React.useState<string>(
    () => valueProp ?? defaultValue ?? ""
  );

  const value = valueProp ?? internalValue;
  const previousValueRef = React.useRef<string | undefined>(valueProp ?? defaultValue);
  const [direction, setDirection] = React.useState(1);
  const orderRef = React.useRef<string[]>(valuesOrder ?? []);

  React.useEffect(() => {
    if (valuesOrder) {
      orderRef.current = valuesOrder;
    }
  }, [valuesOrder]);

  React.useEffect(() => {
    if (valueProp !== undefined && valueProp !== value) {
      const nextDirection = computeDirection(orderRef.current, previousValueRef.current, valueProp);
      setDirection(nextDirection);
      previousValueRef.current = value;
      setInternalValue(valueProp);
    }
  }, [valueProp, value]);

  const handleValueChange = (nextValue: string) => {
    const nextDirection = computeDirection(orderRef.current, value, nextValue);
    setDirection(nextDirection);
    previousValueRef.current = value;
    setInternalValue(nextValue);
    onValueChange?.(nextValue);
  };

  const contextValue = React.useMemo(
    () => ({
      currentValue: value,
      previousValue: previousValueRef.current,
      direction,
    }),
    [direction, value]
  );

  return (
    <TabsAnimationContext.Provider value={contextValue}>
      <TabsPrimitive.Root
        data-slot="tabs"
        className={cn("flex flex-col gap-1", className)}
        value={value}
        defaultValue={defaultValue}
        onValueChange={handleValueChange}
        {...props}
      >
        {children}
      </TabsPrimitive.Root>
    </TabsAnimationContext.Provider>
  );
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "bg-transparent text-foreground inline-flex h-8 w-full items-center justify-between rounded-full",
        className,
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "data-[state=active]:bg-card dark:data-[state=active]:text-foreground focus-visible:outline-ring text-foreground inline-flex h-full flex-1 items-center justify-center gap-1 rounded-full border border-transparent px-6 text-base font-medium whitespace-nowrap transition disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  value,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  const { currentValue, direction } = React.useContext(TabsAnimationContext);
  const tabValue = value ?? "";
  const isActive = currentValue === tabValue;

  const variants = {
    initial: (dir: number) => ({ opacity: 0, x: dir * 36 }),
    enter: { opacity: 1, x: 0, transition: { duration: 0.28, ease: [0.33, 1, 0.68, 1] } },
    exit: (dir: number) => ({ opacity: 0, x: -dir * 36, transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] } }),
  };

  return (
    <AnimatePresence mode="wait" initial={false} custom={direction}>
      {isActive ? (
        <motion.div
          key={tabValue}
          custom={direction}
          variants={variants}
          initial="initial"
          animate="enter"
          exit="exit"
        >
          <TabsPrimitive.Content
            value={tabValue}
            data-slot="tabs-content"
            className={cn("flex-1 outline-none", className)}
            {...props}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };

function computeDirection(order: string[], previous?: string, next?: string) {
  if (!previous || !next || previous === next) return 1;

  const prevIndex = order.indexOf(previous);
  const nextIndex = order.indexOf(next);

  if (prevIndex !== -1 && nextIndex !== -1) {
    const delta = nextIndex - prevIndex;
    if (delta < 0) return -1;
    if (delta > 0) return 1;
  }

  return 1;
}
