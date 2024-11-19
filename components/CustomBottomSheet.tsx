import { View, Text, Dimensions } from 'react-native'
import React from 'react'
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { styles } from '@/app/styles/HomeScreenStyles'
interface Props{
children:any;
bottomSheetModalRef:any;
handleSheetChanges?:(item:any)=>void

}
const WINDOW_HEIGHT=Dimensions.get('window').height
const CustomBottomSheet:React.FC<Props> = ({bottomSheetModalRef,handleSheetChanges,children}) => {
  return (
    <BottomSheetModal
            ref={bottomSheetModalRef}
            onChange={handleSheetChanges }>
            
            <BottomSheetView style={styles.contentContainer}>
             {children}
             
            </BottomSheetView>
        
        </BottomSheetModal>
  )
}

export default CustomBottomSheet
