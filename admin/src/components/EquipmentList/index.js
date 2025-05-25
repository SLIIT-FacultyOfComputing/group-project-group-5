import FilterButtons from './FilterButtons';
import SearchBar from './SearchBar';
import Admin_TableView from './Admin_TableView';
import Admin_CardView from './Admin_CardView';
import Staff_TableView from './Staff_TableView';
import Staff_CardView from './Staff_CardView';
import EmptyState from './EmptyState';
import { TableSkeleton, CardSkeleton } from './LoadingSkeleton';


// Export individual components
export {
  FilterButtons,
  SearchBar,
  Admin_TableView,
  Admin_CardView,
  Staff_TableView,
  Staff_CardView,
  EmptyState,

};

// Export LoadingSkeletons as an object with TableSkeleton and CardSkeleton properties
export const LoadingSkeletons = {
  TableSkeleton,
  CardSkeleton
};