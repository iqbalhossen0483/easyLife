import {
  AntDesign,
  Entypo,
  FontAwesome,
  FontAwesome5,
  Fontisto,
  Foundation,
  MaterialIcons,
  Octicons,
} from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { View } from "react-native";

import useStore from "../../context/useStore";
import { styles } from "../../css/footer";
import { role } from "../../services/common";
import Drawar from "../Drawar";
import { color } from "../utilitise/colors";
import Menu from "./Menu";
import SubMenu from "./SubMenu";

function Footer() {
  const store = useStore();

  return store?.user?.designation === role.admin ? (
    <AdminFooter database={store.database} />
  ) : (
    <UserFooter database={store.database} user={store.user} />
  );
}

function AdminFooter({ database }) {
  const [createModal, setCreateModal] = useState(false);
  const [moreOption, setMoreOption] = useState(false);
  const route = useRoute();

  return (
    <View style={styles.container}>
      {/* home */}
      <Menu
        name='Home'
        navigate='home'
        Icon={
          <Entypo
            style={[
              route.name === "home"
                ? { color: color.green }
                : { color: "#4b5563" },
              { fontSize: 20 },
            ]}
            name='home'
            size={24}
            color='black'
          />
        }
      />

      {/* customer */}
      <Menu
        name='Customer'
        navigate='customer'
        Icon={
          <FontAwesome5
            style={[
              route.name === "customer"
                ? { color: color.green }
                : { color: "#4b5563" },
              { fontSize: 20 },
            ]}
            name='users'
            size={24}
            color='black'
          />
        }
      />

      {/* plus */}
      <Menu
        name=''
        navigate={false}
        showModal={setCreateModal}
        Icon={
          <AntDesign
            style={{ color: "#4b5563" }}
            name='pluscircle'
            size={35}
            color='black'
          />
        }
      />

      {/* order */}
      <Menu
        name='Orders'
        navigate='order'
        Icon={
          <Foundation
            style={[
              route.name === "order"
                ? { color: color.green }
                : { color: "#4b5563" },
              { fontSize: 20 },
            ]}
            name='shopping-cart'
            size={24}
            color='black'
          />
        }
      />

      {/* more */}
      <Menu
        name='more'
        showModal={setMoreOption}
        navigate={false}
        Icon={
          <MaterialIcons
            style={{ color: "#4b5563", fontSize: 20 }}
            name='more'
            size={24}
            color='black'
          />
        }
      />

      {/* add menu modals */}
      <Drawar setShowModal={() => setCreateModal(false)} show={createModal}>
        <SubMenu
          name={database.production ? "Add Customer" : "Add Shop"}
          url='addshop'
          bgColor='#d1fae5'
          showModal={setCreateModal}
          icon={<Entypo name='shop' size={20} color='#10b981' />}
        />

        <SubMenu
          name='Create Order'
          url='createOrder'
          bgColor='#cffafe'
          showModal={setCreateModal}
          icon={
            <FontAwesome name='shopping-basket' size={18} color='#06b6d4' />
          }
        />

        {database.production ? (
          <SubMenu
            name='Production'
            url='production'
            bgColor='#e8bcf5'
            showModal={setCreateModal}
            icon={<AntDesign name='shoppingcart' size={20} color='#cc21fc' />}
          />
        ) : null}

        <SubMenu
          name='Purchase Product'
          url='purchase'
          bgColor='#c8e1fa'
          showModal={setCreateModal}
          icon={<AntDesign name='shoppingcart' size={20} color='#157ce6' />}
        />

        <SubMenu
          name='Create Note'
          url='createNote'
          bgColor='#ecfccb'
          showModal={setCreateModal}
          icon={<MaterialIcons name='note-add' size={24} color='#84cc16' />}
        />
        <SubMenu
          name='Add Expense'
          url='addExpense'
          bgColor='#f2e4f0'
          showModal={setCreateModal}
          icon={<AntDesign name='pay-circle-o1' size={24} color='#c912ae' />}
        />
      </Drawar>

      {/* more modal */}
      <Drawar setShowModal={() => setMoreOption(false)} show={moreOption}>
        <SubMenu
          name='Manage Product'
          url='manageProduct'
          bgColor='#ecfccb'
          border
          showModal={setMoreOption}
          icon={<Fontisto name='shopping-store' size={16} color='#84cc16' />}
        />

        <SubMenu
          name='Manage Users'
          url='manageUsers'
          bgColor='#e0f2fe'
          border
          showModal={setMoreOption}
          icon={<FontAwesome5 name='users' size={16} color='#0284c7' />}
        />

        <SubMenu
          name='Manage Supplyer'
          url='manageSupplyer'
          bgColor='#f0d8ef'
          border
          showModal={setMoreOption}
          icon={<Entypo name='users' size={18} color='#d620cd' />}
        />

        <SubMenu
          name='Expense Report'
          url='expenseReport'
          bgColor='#ebc19b'
          border
          showModal={setMoreOption}
          icon={<MaterialIcons name='report' size={24} color='#a14f03' />}
        />
        <SubMenu
          name='Transition History'
          url='transitions'
          bgColor='#faeeca'
          border
          showModal={setMoreOption}
          icon={
            <MaterialIcons name='manage-history' size={22} color='#806003' />
          }
        />

        {database.production ? (
          <SubMenu
            name='Production History'
            url='production-history'
            bgColor='#f0d8ef'
            border
            showModal={setMoreOption}
            icon={<FontAwesome name='product-hunt' size={18} color='#d620cd' />}
          />
        ) : null}

        <SubMenu
          name='Settings'
          url='info'
          bgColor='#afc8f0'
          border
          showModal={setMoreOption}
          icon={<AntDesign name='setting' size={20} color='#1f69e0' />}
        />
      </Drawar>
    </View>
  );
}

function UserFooter({ database, user }) {
  const [moreOption, setMoreOption] = useState(false);
  const route = useRoute();

  return (
    <View style={styles.container}>
      {/* home */}
      <Menu
        name='Home'
        navigate='profile'
        Icon={
          <Entypo
            style={[
              route.name === "profile"
                ? { color: color.green }
                : { color: "#4b5563" },
            ]}
            name='home'
            size={21}
          />
        }
      />

      {/* customer */}
      <Menu
        name='Customer'
        navigate='customer'
        Icon={
          <FontAwesome5
            style={[
              route.name === "customer"
                ? { color: color.green }
                : { color: "#4b5563" },
            ]}
            name='users'
            size={21}
          />
        }
      />

      {/* order */}
      <Menu
        name='Order'
        navigate='createOrder'
        Icon={
          <Foundation
            style={[
              route.name === "createOrder"
                ? { color: color.green }
                : { color: "#4b5563" },
            ]}
            name='shopping-cart'
            size={25}
          />
        }
      />

      {/* expense */}
      <Menu
        name='Expense'
        navigate='addExpense'
        Icon={
          <FontAwesome5
            name='money-bill'
            size={21}
            style={[
              route.name === "addExpense"
                ? { color: color.green }
                : { color: "#4b5563" },
            ]}
          />
        }
      />

      {/* more */}
      <Menu
        name='More'
        showModal={setMoreOption}
        Icon={
          <MaterialIcons
            style={{ color: "#4b5563", fontSize: 20 }}
            name='more'
            size={24}
          />
        }
      />

      {/* more modal */}
      <Drawar setShowModal={() => setMoreOption(false)} show={moreOption}>
        <SubMenu
          name='Orders'
          url='order'
          bgColor='#05b5a6'
          showModal={setMoreOption}
          border
          icon={<MaterialIcons name='note-add' size={18} color='#fff' />}
        />

        <SubMenu
          name='Notes'
          url='createNote'
          bgColor='#2c8c06'
          showModal={setMoreOption}
          border
          icon={<MaterialIcons name='note-add' size={18} color='#fff' />}
        />

        <SubMenu
          name={database.production ? "Add Customer" : "Add Shop"}
          url='addshop'
          bgColor='#d1fae5'
          showModal={setMoreOption}
          icon={<Entypo name='shop' size={20} color='#10b981' />}
        />

        <SubMenu
          name='Expense Report'
          url='expenseReport'
          bgColor='#ebc19b'
          border
          showModal={setMoreOption}
          icon={<MaterialIcons name='report' size={24} color='#a14f03' />}
        />
        <SubMenu
          name='Transition History'
          url='transitions'
          bgColor='#faeeca'
          border
          showModal={setMoreOption}
          icon={<Octicons name='history' size={16} color='#806003' />}
        />
        {user.designation === role.store_manager ? (
          <>
            <SubMenu
              name='Manage Users'
              url='manageUsers'
              bgColor='#e0f2fe'
              border
              showModal={setMoreOption}
              icon={<FontAwesome5 name='users' size={16} color='#0284c7' />}
            />
            <SubMenu
              name='Stock Report'
              url='stock'
              bgColor='#e0f2fe'
              border
              showModal={setMoreOption}
              icon={
                <MaterialIcons
                  name='production-quantity-limits'
                  size={18}
                  color='#0284c7'
                />
              }
            />
            {database.production ? (
              <>
                <SubMenu
                  name='Production'
                  url='production'
                  bgColor='#e8bcf5'
                  showModal={setMoreOption}
                  icon={
                    <AntDesign name='shoppingcart' size={20} color='#cc21fc' />
                  }
                />
                <SubMenu
                  name='Production History'
                  url='production-history'
                  bgColor='#f0d8ef'
                  border
                  showModal={setMoreOption}
                  icon={
                    <FontAwesome
                      name='product-hunt'
                      size={18}
                      color='#d620cd'
                    />
                  }
                />
              </>
            ) : null}
          </>
        ) : null}
      </Drawar>
    </View>
  );
}

export default Footer;
