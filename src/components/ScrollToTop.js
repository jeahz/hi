// https://www.geeksforgeeks.org/how-to-make-your-page-scroll-to-the-top-when-route-changes/
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { goToTop } from './Helper';
  
export default function GoToTop() {
  const routePath = useLocation();
  
  useEffect(() => {
    goToTop();
  }, [routePath]);
  
  return null;
}
// https://www.geeksforgeeks.org/how-to-make-your-page-scroll-to-the-top-when-route-changes/
