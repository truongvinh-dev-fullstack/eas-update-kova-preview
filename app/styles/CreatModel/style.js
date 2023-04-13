
import { StyleSheet,Dimensions} from "react-native"

export const modelStyles = StyleSheet.create({
  button: {
    height: 50 
  },

  body: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    height: "85%",
    position: 'relative'
  },
  footer: {
    marginTop: 20,
    // flex: 1,
  },
  genderTxt: {
    color: "#697077",
    fontSize: 14,
    marginTop: '5%',
    marginBottom: '5%',
    width: '100%',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  genderTxt2: {
    color: "#697077",
    fontSize: 14,
    marginTop: '5%',
    width: '100%',
    textAlign: 'center'
  },
  genderImg: {
    width: '80%',
    height: "65%"
  },
  chooseGender: {
    marginTop: '8%',
    width: '100%',
    flexDirection: 'row'
  },

  enterInfoLabel: {
    color: "#697077",
    marginTop: '10%',
    marginBottom: '5%',
    width: '100%',
    fontSize: 14
  },
  heightSlider: {
    width: "100%",
    height: 60
  },
  weightSlider: {
    width: "100%",
    height: 60
  },

  takeAPhoto: {
    width: '100%',
    height: 220
  },
  takeAPhotoTitle: {
    color: "#697077",
    fontSize: 14,
    marginTop: 20,
    marginBottom: 20,
    width: '100%',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  step3Type: {
    color: "#697077",
    fontSize: 14,
    marginTop: '5%',
    marginBottom: '5%',
    textAlign: 'center',
  },
  step3TypeWp: {
    width: '100%',
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  wvTutorial: {
    width: "100%",
    minHeight: "45%",
    maxHeight: 400,
    "shadowColor": "#000",
    "shadowOffset": {
      "width": 1,
      "height": 1
    },
    "shadowOpacity": 0.4,
    "shadowRadius": 3,
    "elevation": 5,
    marginBottom: 10
  },

  pagerView: {
    height: "60%",
    minHeight: 300,
    width: "100%",
    position: 'relative',
  },
  bannerImg: {
    height: '100%',
    width: '100%',
    resizeMode: "contain",
  },


  tHeader: {
    backgroundColor: "transparent",
    alignItems: "flex-end",

  },
  tFooter: {
    position: 'absolute',
    left: 0,
    bottom: '5%',
    width: '100%',
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 29

  },
  tToggleCamera: {
    width: 50,
    height: 50,
    marginTop: 17,
    marginRight: 29
  },
  tCancelIcon: {
    marginRight: 10,
    width: 30,
    height: 30,
  },
  tCamera: {
    width: 70,
    height: 70,
  },
  tGallery: {
    width: 40,
    height: 40,
  },

  tFaceIcon: {
    width: 50,
    height: 50,
    position: 'absolute',
    right: "5%",
    top: "7%"
  },

  customModelGroup: {
    width: '100%',
    paddingHorizontal: '4%',
    marginTop: 30,
  },
  step6Text: {
    color: "#697077",
    fontSize: 14,
    marginBottom: 10,
  },
  step6chooseFace: {
    marginHorizontal: '-2%'
  },
  step6chooseColor: {
    marginHorizontal: '-2%'
  },
  step6FaceIcon: {
    width: 50,
    height: 50,
    marginHorizontal: '2%',
    borderRadius: 50,
    overflow: "hidden",
    backgroundColor: "#f7f7f7",
  },
  faceSelected: {
    borderWidth: 1,
    borderColor: '#991D1D'
  },
  skinColorSelected: {
    borderWidth: 1,
    borderColor: '#991D1D'
  },
});