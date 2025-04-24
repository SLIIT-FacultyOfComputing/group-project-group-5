import FilterButtons from './FilterButtons';
import SearchBar from './SearchBar';
import TableView from './TableView';
import CardView from './CardView';
import EmptyState from './EmptyState';
import { TableSkeleton, CardSkeleton } from './LoadingSkeleton';


// Export individual components
export {
  FilterButtons,
  SearchBar,
  TableView,
  CardView,
  EmptyState,

};

// Export LoadingSkeletons as an object with TableSkeleton and CardSkeleton properties
export const LoadingSkeletons = {
  TableSkeleton,
  CardSkeleton
};