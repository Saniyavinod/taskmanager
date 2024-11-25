import { View, Text, Dimensions } from 'react-native'
import React, { Dispatch, SetStateAction } from 'react'
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { styles } from '@/app/styles/HomeScreenStyles'

type indiTask = {
  id:string
  taskname: string;
  description: string;
  startTime: Date
  endTime: Date
  date: Date
}


interface Props{
children:any;
bottomSheetModalRef:any;
handleSheetChanges?:(item:any)=>void
setBottomSheetVisible:Dispatch<SetStateAction<boolean>>
setIndiTask:Dispatch<SetStateAction<indiTask | null>>
}



const WINDOW_HEIGHT=Dimensions.get('window').height
const CustomBottomSheet:React.FC<Props> = ({bottomSheetModalRef,handleSheetChanges,children,setBottomSheetVisible,setIndiTask}) => {

  const handleModalDismiss = () =>{
    setBottomSheetVisible(false)
    setIndiTask(null)
  }

  return (
    <BottomSheetModal style={{flex:1}}
            ref={bottomSheetModalRef}
            onChange={handleSheetChanges } snapPoints={["95%"]} onDismiss={handleModalDismiss} enableDismissOnClose={true}>
            
            <BottomSheetView style={styles.contentContainer}>
             {children}
             
            </BottomSheetView>
        
        </BottomSheetModal>
  )
}

export default CustomBottomSheet
