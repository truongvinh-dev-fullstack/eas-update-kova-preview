import React, { useState, useEffect } from "react"
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  useIsDrawerOpen,
} from "@react-navigation/drawer"
import { Image, StyleSheet, View } from "react-native"
import {
  Divider,
  OverflowMenu,
  MenuItem,
  Button,
  Avatar,
  Modal,
  Card,
  Text,
  RadioGroup,
  Radio,
} from "@ui-kitten/components"
import {
  faUser,
  faCalendarWeek,
  faUtensils,
  faMapMarkerAlt,
  faVideo,
  faImages,
  faUnlock,
  faGlobe,
  faAngleDown,
  faAngleUp
} from "@fortawesome/free-solid-svg-icons";
import Accordion from 'react-native-collapsible/Accordion';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import i18n from "i18n-js"
import { UnitOfWorkService } from '../services/api/unitOfWork-service';
const _unitOfWork = new UnitOfWorkService();
const logoImage = require("../../assets/icon.png")

const UserIcon = (props) => <FontAwesomeIcon icon={faUser} {...props} />
const EventIcon = (props) => <FontAwesomeIcon icon={faCalendarWeek} {...props} color={"red"} />
const UtensilsIcon = (props) => <FontAwesomeIcon icon={faUtensils} {...props} color={"green"} />
const PlaceIcon = (props) => <FontAwesomeIcon icon={faMapMarkerAlt} {...props} color={"#0adeb7"} />

const UnLockIcon = (props) => <FontAwesomeIcon icon={faUnlock} {...props} color={"#e4ff00"} />
const VideoIcon = (props) => <FontAwesomeIcon icon={faVideo} {...props} color={"#ff7600"} />
const PhotoIcon = (props) => <FontAwesomeIcon icon={faImages} {...props} color={"#fb00ff"} />
const GlobeIcon = (props) => <FontAwesomeIcon icon={faGlobe} {...props} color={"green"} />
const AngleDownIcon = (props) => <FontAwesomeIcon icon={faAngleDown} {...props} />
const AngleUpIcon = (props) => <FontAwesomeIcon icon={faAngleUp} {...props} />
export function SidebarDrawer(props) {
  const { state, ...rest } = props
  const [user, setUser] = useState(null);
  const [visible, setVisible] = React.useState(false);
  const [sections,setSections] = useState([]);
  const [brands,setBrands]= useState([]);
  const [activeSections, setActiveSections] = useState([0])
  const newState = { ...state } //copy from state before applying any filter. do not change original state
  newState.routes = newState.routes.filter(
    (item) => item.name !== "Đăng nhập" && item.name !== "Đăng ký",
  );
  useEffect(() => {
    fetchLeftMenu();
  },[])
  const fetchLeftMenu = async () => {
    let res = await _unitOfWork.store.getDataLeftMenu({});
    if(res.data.StatusCode === 200){
      setSections(res.data.ListCategory);
      setBrands(res.data.ListBrand);
    }
  }
  const _renderHeader = (section, index, isActive, sections) => {
    return (
      <View style={{ ...styles.menu_item, flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ ...styles.accordion_item, color: isActive ? '#339af0' : 'black' }}>{section.CategoryName}</Text>
        <View style={{ height: 40, marginTop: 14, flexDirection: 'row', justifyContent: 'flex-end' }}>
          {
            activeSections.findIndex(f => f == section.key) > -1 ? <AngleUpIcon style={{ textAlign: 'right', color: '#339af0' }} /> : <AngleDownIcon style={{ textAlign: 'right', color: '#484a4d' }} />
          }

        </View>
      </View>
    );
  };

  const _renderContent = section => {
    return (
      <View style={{ paddingLeft: 15 }}>
        <View>
        {
          section.ChildrenCategory && section.ChildrenCategory.length > 0 && section.ChildrenCategory.map(item => {
            return   <DrawerItem
            label={item.CategoryName}
            // icon={EventIcon}
            labelStyle={styles.registerLoginLabel}
            style={{ height: 40 }}
            onPress={() => {}}
          />
          })
        }
        </View>
      </View>
    );
  };
  const _updateSections = newActiveSections => {
    setActiveSections(newActiveSections);
  };
  return (
    <DrawerContentScrollView {...props}>
      <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
        <View>
          <Text style={styles.menu_item}>DANH MỤC SẢN PHẨM</Text>
        </View>

      </View>
      <Accordion
        activeSections={activeSections}
        renderContent={_renderContent}
        renderHeader={_renderHeader}
        sections={[...sections]}
        onChange={_updateSections}
        containerStyle={{ paddingLeft: 35, paddingRight: 20 }}
      />
      <View style={{ paddingHorizontal: 20 }}>
        <View>
          <Text style={styles.menu_item}>DANH MỤC NHÃN HÀNG</Text>
        </View>
      </View>
      {
        brands.length > 0 && brands.map(item => {
          return <View style={{ paddingLeft: 35, paddingRight: 20 }}>
          <View>
            <Text style={{ ...styles.accordion_item }}>{item.StoreName}</Text>
          </View>
        </View>
        })
      }
    </DrawerContentScrollView>
  )
}

const styles = StyleSheet.create({
  logoImage: {
    height: 20,
    width: 140,
    margin: 16,
  },
  registerLoginLabel: {
    // marginLeft: -10,
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },
  accordion_item: {
    fontSize: 14,
    lineHeight: 40
  },
  menu_item: {
    height: 40,
    lineHeight: 40
  }
})
