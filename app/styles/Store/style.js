
import { StyleSheet } from "react-native"

export const StoreStyles = StyleSheet.create({
  storeInfo: {
    // flex: 1,
    height: 140,
    flexDirection: 'row',
    paddingVertical: '2%',
    paddingHorizontal: '4%',

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
    marginBottom: '4%'
  },
  storeLogo: {
    width: '30%',
  },
  storeInfoTxt: {
    width: '70%',
    height: '100%',
    paddingLeft: '3%',
    flex: 1,
    // flexDirection: 'row',
    // flexWrap: "wrap",
    justifyContent: 'center',
    // alignItems: 'center',
    // alignContent: 'center'
  },
  storeInfoGray: {
    color: '#697077'
  },
  tryVRItem: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  filterIconWp: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: '100%'
  },
  divider: {
    backgroundColor: "#697077",
    width: "50%",
    position: "absolute",
    bottom: "25%",
    left: "10%",
  },
  filterIcon: {
    width: 25,
    height: 30,
    resizeMode: 'contain',
  },

  products: {
    width: '100%',
    paddingHorizontal: '2%',
    // paddingVertical: '4%',
    paddingTop: '2%',
    // paddingBottom: '4%',
    // flexDirection: 'row',
    // flexWrap: 'wrap'
  },

  item: {
    width: '50%',
    position: "relative",
    padding: '2%',
    marginBottom: 15,
  },
  productImageWp: {
    height: 170
  },
  productImage: {
    // borderRadius: 10
  },
  favoriteTouch: {
    position: "absolute",
    right: 8,
    top: 16,
    width: 37,
    height: 37
  },
  productName: {
    color: "#A2A9B0",
    marginTop: 10,
    fontSize: 14,
  },
  originalPrice: {
    marginTop: 5,
  },
  opp: {
    color: "rgba(105, 112, 119, 1)",
    fontSize: 14,
    fontWeight: "bold",
    textDecorationLine: "line-through",
  },
  opc: {
    color: "rgba(105, 112, 119, 1)",
    fontSize: 10,
    marginLeft: 3,
  },

  price: {
    marginTop: 5,
  },
  pt: {
    color: "#991D1D",
    fontSize: 18,
    fontWeight: "bold",
  },
  pc: {
    color: "#991D1D",
    fontSize: 10,
    marginLeft: 3,
  },

  pagination: {
    justifyContent: 'center'
  },
  pageBtn: {
    color: '#4D5358',
    fontSize: 14,
    marginHorizontal: 5
  },

  showAllItem: {
    paddingHorizontal: '4%',
    paddingVertical: '4%'
  },
  showAllItemBtn: {
    borderColor: '#991D1D',
    backgroundColor: 'white',
  },

  bottom_section: {
    height: 400,
    backgroundColor: "#6C0F0F",
    position: "relative",
  },
  bottom_text: {
    color: "#F2F4F8",
    textAlign: "center",
    alignSelf: "center",
    flex: 1,
    fontSize: 16,
  },
  bottom_logo: {
    marginTop: 80,
    marginBottom: 20,
    alignSelf: "center",
    width: 150,
    height: 80,
    resizeMode: "cover",
  },
  to_top: {
    position: "absolute",
    width: 50,
    height: 50,
    right: 10,
    top: 20,
  }
});