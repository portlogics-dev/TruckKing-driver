/**
 * @format
 */

import { render } from "@testing-library/react-native";
import React from "react";

import App from "../App";

describe("App", () => {
  it("renders correctly", () => {
    render(<App />);
    // 필요한 경우 특정 요소를 찾아서 테스트
    // expect(getByTestId('some-test-id')).toBeTruthy();
  });
});
