import { useEffect, useState } from "react";
import { Text, View } from "react-native";

import BDT from "../utilitise/BDT";

function TimerComponent({ runningTarget }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const end_date = runningTarget.end_date;
    function calculate() {
      const currentTime = new Date();
      const distance = new Date(end_date).getTime() - currentTime.getTime();

      const day = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      setTime(day + "d " + hours + "h " + minutes + "m");
    }
    calculate();
    const timer = setInterval(() => {
      calculate();
    }, 60 * 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <View>
      <Text style={{ color: "#9e4c0d" }}>Ending In: {time}</Text>
      <Text>
        Targeted Amnt: <BDT amount={runningTarget.targetedAmnt} />
      </Text>
      <Text>
        Achieved Amnt: <BDT amount={runningTarget.achiveAmnt} />
      </Text>
      <Text>
        Remaining Amnt:{" "}
        <BDT amount={runningTarget.targetedAmnt - runningTarget.achiveAmnt} />
      </Text>
      <Text>
        You will get:{" "}
        <BDT
          amount={(runningTarget.targetedAmnt * runningTarget.commission) / 100}
        />
      </Text>
    </View>
  );
}

export default TimerComponent;
