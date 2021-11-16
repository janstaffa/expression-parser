import { Token } from './tokenizer';

export class ASTNode {
  value: Token;
  leftChild: ASTNode | null;
  rightChild: ASTNode | null;
  constructor(
    value: Token,
    leftChild: ASTNode | null,
    rightChild: ASTNode | null
  ) {
    this.value = value;
    this.leftChild = leftChild;
    this.rightChild = rightChild;
  }

  resolve = () => {
    return this.value;
  };
}
