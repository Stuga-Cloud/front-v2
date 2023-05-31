import React from "react";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { styled } from "@stitches/react";
import { violet, blackA } from "@radix-ui/colors";

export default function RadioButtons({
    onChange,
}: {
    onChange: (value: string) => void;
}) {
    return (
        <RadioGroupRoot
            defaultValue="public"
            aria-label="View density"
            onChange={(e) => {
                const selectedValue = e.target.value;
                onChange(selectedValue);
            }}
        >
            <Flex css={{ alignItems: "center" }}>
                <RadioGroupItem value="public" id="r1">
                    <RadioGroupIndicator />
                </RadioGroupItem>
                <Label htmlFor="r1">Public</Label>
            </Flex>
            <Flex css={{ alignItems: "center" }}>
                <RadioGroupItem value="private" id="r2">
                    <RadioGroupIndicator />
                </RadioGroupItem>
                <Label htmlFor="r2">Private</Label>
            </Flex>
        </RadioGroupRoot>
    );
}

const RadioGroupRoot = styled(RadioGroup.Root, {
    display: "flex",
    flexDirection: "row",
    gap: 50,
});

const RadioGroupItem = styled(RadioGroup.Item, {
    all: "unset",
    backgroundColor: "white",
    width: 25,
    height: 25,
    borderRadius: "100%",
    boxShadow: `0 2px 10px ${blackA.blackA7}`,
    "&:hover": { backgroundColor: violet.violet3 },
    "&:focus": { boxShadow: `0 0 0 2px black` },
});

const RadioGroupIndicator = styled(RadioGroup.Indicator, {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    position: "relative",
    "&::after": {
        content: '""',
        display: "block",
        width: 11,
        height: 11,
        borderRadius: "50%",
        backgroundColor: violet.violet11,
    },
});

const Flex = styled("div", { display: "flex" });

const Label = styled("label", {
    color: "black",
    fontSize: 15,
    lineHeight: 1,
    paddingLeft: 15,
});
