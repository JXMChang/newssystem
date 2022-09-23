// TopHeader是发布者，SideMenu是订阅者
export const CollApsedReducer = (prevState = {
  isCollapsed:false
}, action) => {
  console.log("action",action);
  let {type} = action
  switch (type) {
    case 'change_collapsed':
      let newState = {...prevState};
      newState.isCollapsed = !newState.isCollapsed
      return newState;
  
    default:
      return prevState;
  }

}