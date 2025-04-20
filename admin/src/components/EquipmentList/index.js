import FilterButtons from './FilterButtons';
import SearchBar from './SearchBar';
import TableView from './TableView';
import CardView from './CardView';
import EmptyState from './EmptyState';
import { TableSkeleton, CardSkeleton } from './LoadingSkeleton';
import ConfirmationModal from './modals/ConfirmationModal';
import SuccessModal from './modals/SuccessModal';
import ErrorModal from './modals/ErrorModal';

// Export individual components
export {
  FilterButtons,
  SearchBar,
  TableView,
  CardView,
  EmptyState,
  ConfirmationModal,
  SuccessModal,
  ErrorModal
};

// Export LoadingSkeletons as an object with TableSkeleton and CardSkeleton properties
export const LoadingSkeletons = {
  TableSkeleton,
  CardSkeleton
};