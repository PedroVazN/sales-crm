import styled from 'styled-components';

export const Container = styled.div`
  padding: 32px;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  min-height: 100vh;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(0, 212, 170, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(236, 72, 153, 0.05) 0%, transparent 50%);
    pointer-events: none;
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  position: relative;
  z-index: 1;
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #00d4aa 0%, #6366f1 50%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  text-shadow: 0 0 30px rgba(0, 212, 170, 0.3);
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 12px 20px;
  min-width: 300px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  
  &:focus-within {
    border-color: #00d4aa;
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.1);
  }
  
  svg {
    color: rgba(255, 255, 255, 0.4);
    margin-right: 12px;
    transition: color 0.2s ease;
  }
  
  &:focus-within svg {
    color: #00d4aa;
  }
`;

export const SearchInput = styled.input`
  background: transparent;
  border: none;
  outline: none;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
  flex: 1;
  font-weight: 500;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
    font-weight: 400;
  }
`;

export const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px 20px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  font-weight: 500;
  
  &:hover {
    color: #00d4aa;
    border-color: #00d4aa;
    background: rgba(0, 212, 170, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 212, 170, 0.2);
  }
`;

export const CreateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #00d4aa 0%, #6366f1 100%);
  border: none;
  border-radius: 12px;
  padding: 12px 20px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 212, 170, 0.3);
    
    &::before {
      left: 100%;
    }
  }
`;

export const Content = styled.div`
  position: relative;
  z-index: 1;
`;

export const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
`;

export const ProductCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 24px;
  backdrop-filter: blur(20px);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(0, 212, 170, 0.05) 0%, rgba(99, 102, 241, 0.05) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    border-color: #00d4aa;
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.3),
      0 0 0 1px rgba(0, 212, 170, 0.2);
    transform: translateY(-5px);
    
    &::before {
      opacity: 1;
    }
  }
`;

export const ProductImage = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #00d4aa, #6366f1);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  color: white;
  position: relative;
  z-index: 1;
`;

export const ProductInfo = styled.div`
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
`;

export const ProductName = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 8px 0;
`;

export const ProductCategory = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 12px 0;
  font-weight: 500;
`;

export const ProductPrice = styled.div`
  font-size: 1.4rem;
  font-weight: 800;
  color: #00d4aa;
  margin-bottom: 8px;
`;

export const ProductStock = styled.div<{ $color: string }>`
  font-size: 0.85rem;
  color: ${({ $color }) => $color};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &::before {
    content: '';
    width: 8px;
    height: 8px;
    background: ${({ $color }) => $color};
    border-radius: 50%;
  }
`;

export const ProductStats = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
`;

export const StatItem = styled.div`
  text-align: center;
`;

export const StatValue = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 4px;
`;

export const StatLabel = styled.div`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
`;

export const ProductActions = styled.div`
  display: flex;
  gap: 8px;
  position: relative;
  z-index: 1;
`;

export const ActionButton = styled.button<{ $variant: 'view' | 'edit' | 'delete' }>`
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  ${({ $variant }) => {
    switch ($variant) {
      case 'view':
        return `
          background: rgba(59, 130, 246, 0.1);
          color: #60a5fa;
          border: 1px solid rgba(59, 130, 246, 0.2);
          
          &:hover {
            background: rgba(59, 130, 246, 0.2);
            color: #93c5fd;
            transform: translateY(-2px);
          }
        `;
      case 'edit':
        return `
          background: rgba(16, 185, 129, 0.1);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.2);
          
          &:hover {
            background: rgba(16, 185, 129, 0.2);
            color: #6ee7b7;
            transform: translateY(-2px);
          }
        `;
      case 'delete':
        return `
          background: rgba(239, 68, 68, 0.1);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.2);
          
          &:hover {
            background: rgba(239, 68, 68, 0.2);
            color: #fca5a5;
            transform: translateY(-2px);
          }
        `;
    }
  }}
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 24px;
  
  p {
    color: rgba(255, 255, 255, 0.7);
    font-size: 1rem;
    font-weight: 500;
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 24px;
  text-align: center;
`;

export const EmptyIcon = styled.div`
  width: 120px;
  height: 120px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(10px);
`;

export const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
`;

export const EmptyDescription = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  max-width: 400px;
  line-height: 1.5;
`;