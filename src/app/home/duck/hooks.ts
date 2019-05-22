import { useState } from 'react';

export const useExpandDataList = initialState => {
  const [isExpanded, setExpanded] = useState(initialState);

  const toggleExpanded = () => {
    const expandedState = !isExpanded;
    setExpanded(expandedState);
  };

  return [isExpanded, toggleExpanded];
};

export const useExpandTable = initialState => {
  const [isExpanded, setExpanded] = useState(initialState);

  const toggleExpanded = () => {
    const expandedState = !isExpanded;
    setExpanded(expandedState);
  };

  return [isExpanded, toggleExpanded];
};

export const useOpenModal = initialState => {
  const [isModalOpen, setModalOpen] = useState(initialState);

  const toggleModalOpen = () => {
    const modalOpenState = !isModalOpen;
    setModalOpen(modalOpenState);
  };

  return [isModalOpen, toggleModalOpen];
};

export const useOpenDropdown = initialState => {
  const [isOpen, setOpen] = useState(initialState);

  const toggleOpen = () => {
    const openState = !isOpen;
    setOpen(openState);
  };

  return [isOpen, toggleOpen];
};
