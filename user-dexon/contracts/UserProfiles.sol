pragma solidity ^0.4.25;
import "./IERC20.sol";
import "./SafeMath.sol";
import "./Ownable.sol";


contract CUserProfiles is Ownable, IERC20{
    using SafeMath for uint256;

    //define User
    struct User{
        string _name;
        uint256 _balance;
        uint32 _held_balance; // deposit
        int32 _reputation;
        // address _address;
        mapping (address => uint256) _allowed;
    }

    // data

    uint256 public _totalSupply;

    mapping(address => User) public _userProfiles;

    //functions of User
    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address owner) public view returns (uint256) {
        return _userProfiles[owner]._balance;
    }

    function allowance(address owner, address spender) public view returns (uint256) {
        return _userProfiles[owner]._allowed[spender];
    }

    function transfer(address to, uint256 value) public returns (bool) {
        _transfer(msg.sender, to, value);
        return true;
    }

    function approve(address spender, uint256 value) public returns (bool) {
        require(spender != address(0));
        _userProfiles[msg.sender]._allowed[spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) public returns (bool) {
        _userProfiles[from]._allowed[msg.sender] = _userProfiles[from]._allowed[msg.sender].sub(value);
        _transfer(from, to, value);
        emit Approval(from, msg.sender, _userProfiles[from]._allowed[msg.sender]);
        return true;
    }

    function increaseAllowance(address spender, uint256 addedValue) public returns (bool) {
        require(spender != address(0));
        _userProfiles[msg.sender]._allowed[spender] = _userProfiles[msg.sender]._allowed[spender].add(addedValue);
        emit Approval(msg.sender, spender, _userProfiles[msg.sender]._allowed[spender]);
        return true;
    }
    function decreaseAllowance(address spender, uint256 subtractedValue) public returns (bool) {
        require(spender != address(0));
        _userProfiles[msg.sender]._allowed[spender] = _userProfiles[msg.sender]._allowed[spender].sub(subtractedValue);
        emit Approval(msg.sender, spender, _userProfiles[msg.sender]._allowed[spender]);
        return true;
    }
    function _editName(address target, string name) internal {
        _userProfiles[target]._name = name;               
    } 
    function _held(address target, uint32 value) internal {
        _userProfiles[target]._balance -= value;               
        _userProfiles[target]._held_balance += value;               
    } 
    function _unheld(address target, uint32 value) internal {
        _userProfiles[target]._held_balance -= value;
        _userProfiles[target]._balance += value;
    }
    function _transfer(address from, address to, uint256 value) internal  {
        require(to != address(0));

        _userProfiles[from]._balance = _userProfiles[from]._balance.sub(value);
        _userProfiles[to]._balance = _userProfiles[to]._balance.add(value);
        emit Transfer(from, to, value);
    }
    function _addReputation(address to) internal {
        require(to != address(0));
        _userProfiles[to]._reputation += 1;
    }
    function _mint(address account, uint256 value) internal  {
        require(account != address(0));
        _totalSupply = _totalSupply.add(value);
        _userProfiles[account]._balance = _userProfiles[account]._balance.add(value);
        emit Transfer(address(0), account, value);
    }
    function _burn(address account, uint256 value) internal  {
        require(account != address(0));
        _totalSupply = _totalSupply.sub(value);
        _userProfiles[account]._balance = _userProfiles[account]._balance.sub(value);
        emit Transfer(account, address(0), value);
    }
    function _burnFrom(address account, uint256 value) internal  {
        _userProfiles[account]._allowed[msg.sender] = _userProfiles[account]._allowed[msg.sender].sub(value);
        _burn(account, value);
        emit Approval(account, msg.sender, _userProfiles[account]._allowed[msg.sender]);
    }

}
