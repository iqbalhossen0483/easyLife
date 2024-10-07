import { View } from "react-native";
import React from "react";

import { commonStyles } from "../../css/common";
import TimerComponent from "./TimerComponent";
import { styles } from "../../css/profile";
import BDT from "../utilitise/BDT";
import P from "../utilitise/P";

const Target = ({ commision, user }) => {
  const targets = {
    pending: 0,
    running: 0,
    achieved: 0,
    failed: 0,
  };

  let runningTarget = null;
  user.targets?.forEach((tc) => {
    if (tc.status === "running") {
      targets.running++;
      runningTarget = tc;
    } else if (tc.status === "achieved") targets.achieved++;
    else if (tc.status === "failed") targets.failed++;
  });

  return (
    <>
      <P bold style={commonStyles.heading}>
        Targets
      </P>
      <View style={styles.workContainer}>
        <View>
          <P>Targets Report</P>
          <P style={{ color: "#75850c" }}>Running: {targets.running}</P>
          <P style={{ color: "#038a0a" }}>Achieved: {targets.achieved}</P>
          <P style={{ color: "#946f09" }}>Failed: {targets.failed}</P>
        </View>
        {runningTarget ? (
          <TimerComponent runningTarget={runningTarget} />
        ) : null}

        {commision ? (
          <View>
            <P bold>Pending Commission</P>
            <P>
              Targeted Amount: <BDT amount={commision.targetedAmount} />
            </P>
            <P>
              Got Commission: <BDT amount={commision.commission} />
            </P>
            <P>
              Status: <P color='green'>Achieve</P>
            </P>
            <P color='orange'>
              {commision.achieve
                ? "Achieve & waiting \n for confirming"
                : "Waiting to achieve"}
            </P>
          </View>
        ) : null}
      </View>
    </>
  );
};

export default Target;
