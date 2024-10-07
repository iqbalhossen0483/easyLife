import { AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

import useStore from "../../context/useStore";
import { commonStyles } from "../../css/common";
import { styles } from "../../css/profile";
import { Fetch, dateFormatter } from "../../services/common";
import { alert } from "../utilitise/Alert";
import { color } from "../utilitise/colors";
import P from "../utilitise/P";

const Notes = ({ navigation, id }) => {
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState(null);
  const store = useStore();
  const [showNotes, setShowNotes] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const notes = await Fetch(
          store.database.name,
          `/notes?userId=${id}`,
          "GET"
        );
        setNotes(notes);
      } catch (error) {
        store.setMessage({ msg: error.message, type: "error" });
      }
    })();
  }, [store.updateNote]);

  function deleteNotes(id) {
    alert("Are you sure to log Out?", async () => {
      try {
        setLoading(true);
        const { message } = await Fetch(
          store.database.name,
          `/notes?id=${id}`,
          "DELETE"
        );
        setLoading(false);
        store.setMessage({ msg: message, type: "success" });
        const rest = notes.filter((item) => item.id !== id);
        setNotes(rest);
      } catch (error) {
        setLoading(false);
        store.setMessage({ msg: error.message, type: "error" });
      }
    });
  }

  return (
    <View>
      <P bold style={commonStyles.heading}>
        Your Notes
      </P>

      <Pressable
        onPress={() => setShowNotes((prev) => !prev)}
        style={{ position: "absolute", right: 15, top: 20 }}
      >
        {showNotes ? (
          <Entypo name='eye' size={24} color={color.green} />
        ) : (
          <Entypo name='eye-with-line' size={24} color={color.green} />
        )}
      </Pressable>

      <View style={styles.noteContainer}>
        {loading ? <P align='center'>Loading...</P> : null}
        {showNotes && notes && notes.length ? (
          notes.map((item, i, arr) => (
            <View
              key={item.id}
              style={arr.length - 1 !== i ? styles.noteItem : {}}
            >
              <View style={styles.headingContainer}>
                <View>
                  <P
                    bold
                    color='green'
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: color.green,
                    }}
                  >
                    {item.heading}
                  </P>
                  <P color='darkGray' size={13}>
                    {dateFormatter(item.date)}
                  </P>
                  <P>{item.description}</P>
                </View>

                <View style={{ rowGap: 5 }}>
                  <Pressable
                    onPress={() =>
                      navigation.navigate("createNote", {
                        data: item,
                        edit: true,
                      })
                    }
                  >
                    <AntDesign name='edit' size={20} color={color.darkGray} />
                  </Pressable>
                  <Pressable onPress={() => deleteNotes(item.id)}>
                    <MaterialIcons
                      name='delete'
                      size={20}
                      color={color.orange}
                    />
                  </Pressable>
                </View>
              </View>
            </View>
          ))
        ) : (
          <Text style={{ textAlign: "center" }}>
            {showNotes ? "No notes" : "Notes are hidden"}
          </Text>
        )}
      </View>
    </View>
  );
};

export default Notes;
