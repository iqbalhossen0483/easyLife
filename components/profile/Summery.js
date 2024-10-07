import { View } from "react-native";
import React from "react";

import { commonStyles } from "../../css/common";
import { styles } from "../../css/profile";
import BDT from "../utilitise/BDT";
import P from "../utilitise/P";

const Summery = ({ user }) => {
  return (
    <View style={{ zIndex: 0 }}>
      <P bold style={commonStyles.heading}>
        Summery
      </P>
      <View style={styles.workContainer}>
        <View>
          <P color='lightBlue'>
            Balance: <BDT amount={user.haveMoney} />
          </P>
          <P color='red'>
            Debt: <BDT amount={user.debt} />
          </P>
          <P>
            Got Salary: <BDT amount={user.get_salary} />
          </P>
          <P>
            Got Incentive: <BDT amount={user.incentive} />
          </P>
        </View>
        <View>
          <P>
            Delivered Order:
            <BDT amount={user.delivered_order} bdtSign={false} />
          </P>
          <P>
            Total Sale: <BDT amount={user.total_sale} bdtSign={false} />
          </P>
          <P>
            Due Sale: <BDT amount={user.due_sale} bdtSign={false} />
          </P>
          <P>
            Due Coll: <BDT amount={user.due_collection} bdtSign={false} />
          </P>
        </View>
      </View>
    </View>
  );
};

export default Summery;
