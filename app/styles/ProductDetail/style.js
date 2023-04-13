
import { StyleSheet } from "react-native"

export const pdStyles = StyleSheet.create({
  pagerView: {
    flex: 1,
    height: 350,
  },

  bannerImg: {
    height: '100%',
    position: "relative",
  },

  favoriteTouch: {
    bottom: 15,
    height: 37,
    position: "absolute",
    right: 12,
    width: 37,
  },

  price: {
    marginTop: 5,
  },
  pt: {
    color: "#991D1D",
    fontSize: 28,
    fontWeight: '800',
  },
  pc: {
    color: "#991D1D",
    fontSize: 11,
    marginLeft: 5,
    fontWeight: '300',
  },

  productCode:
  {
    fontSize: 14,
    color: "#697077",
    marginTop: 5
  },

  selectColorWp: {
    marginTop: 18
  },

  selectColor: {
    width: 20,
    height: 20,
    borderRadius: 50,
    marginRight: 22,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: "hidden"
  },

  sizeSelector: {
    marginTop: 18,
    paddingHorizontal: '4%'
  },

  selectSize: {
    marginRight: 12,
    maxWidth: 55
  },

  sizeSuggest: {
    marginTop: 18,
    paddingHorizontal: '4%',
    justifyContent: 'space-between'
  },

  productDescription: {
    marginTop: 18,
    paddingHorizontal: '4%',
  },
  buyNow: {
    marginTop: 18,
    paddingHorizontal: '4%',
  },
  storeInfo: {
    marginTop: 18,
    paddingHorizontal: '4%',

    height: "auto",
    paddingVertical: '2%',

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,

    elevation: 3,
  },
  storeLogo: {
    width: '30%',
    height: 64,
    marginRight: 10
  },
  storeInfoTxt: {
    width: '70%',
    height: 64,
    flex: 1,
    justifyContent: 'center',
  },

  storeInfoGray: {
    color: '#697077',
    marginTop: 4
  },
  showShopDetail: {
    width: '30%',
    marginRight: 10
  },
  suggestion: {
    marginTop: 18,
    paddingHorizontal: '2%',
  },
  productSuggestion: {
    marginTop: 12,
    position: 'relative',
    paddingBottom: 100
    // zIndex: 2
    // width: '100%',
    // flexDirection: 'row',
    // flexWrap: 'wrap'
  },
  suggestionBackdrop: {
    width: '120%',
    height: '100%',
    backgroundColor: '#121619',
    position: 'absolute',
    top: '20%',
    left: '-4%',
    zIndex: -1
  },
  productSuggestionRow: {
    // height: 150
  },
  item: {
    width: 200,
    // height: 280,
    position: "relative",
    paddingHorizontal: '4%',
    marginBottom: 15,
  },
  productImageWp: {
    height: 200,
    backgroundColor: 'transparent'
  },
  productImage: {
    borderRadius: 10,
  },
  favoriteTouch: {
    position: "absolute",
    right: 8,
    top: 16,
    width: 37,
    height: 37
  },
  productName: {
    color: "#F2F4F8",
    marginTop: 10,
    fontSize: 14,
  },

  price: {
    marginTop: 5,
  },
  pt: {
    fontSize: 16,
    fontWeight: "bold",
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
  },

  // Model bảng quy đổi size
  centeredView: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    // marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
})