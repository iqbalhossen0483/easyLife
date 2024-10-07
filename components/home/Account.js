import { View } from "react-native";

import { commonStyles } from "../../css/common";
import { style } from "../../css/home";
import BDT from "../utilitise/BDT";
import P from "../utilitise/P";

const Account = ({ users }) => {
  const styles = { width: "30%" };

  return (
    <View style={style.accountContainer}>
      <P
        bold
        style={{
          ...commonStyles.heading,
          marginTop: 0,
          width: "100%",
          marginBottom: 15,
        }}
      >
        Account of Money
      </P>
      <View
        style={{
          ...commonStyles.tableRow,
          paddingVertical: 5,
          paddingLeft: 10,
        }}
      >
        <P
          style={{
            width: "40%",
          }}
          bold
        >
          Name
        </P>
        <P style={styles} bold>
          Debt
        </P>
        <P style={styles} bold>
          Balance
        </P>
      </View>
      {users && users.length ? (
        users.map((item) => (
          <View
            style={{
              ...commonStyles.tableRow,
              borderTopWidth: 0,
              paddingLeft: 10,
            }}
            key={item.id}
          >
            <P style={{ width: "40%" }}>{item.name}</P>
            <BDT style={styles} amount={item.debt} />
            <BDT style={styles} amount={item.haveMoney} />
          </View>
        ))
      ) : (
        <P align='center' style={{ marginTop: 4 }}>
          No Balance
        </P>
      )}
    </View>
  );
};

export default Account;
