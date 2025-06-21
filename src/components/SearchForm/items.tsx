import { useEffect, useState, useMemo, useRef, ReactNode } from 'react'
import { Checkbox, Input, TreeSelect, Spin, TreeSelectProps } from 'antd'
import { isArray, uniqBy } from 'lodash'
import Icon from '@ant-design/icons'
import searchIcon from '@/assets/icon/search.svg'
import './index.less'
import classNames from 'classnames'
import { isValid } from '@/utils/util'
import CustomEmpty from '../CustomEmpty'
import { useDebounceFn } from 'ahooks'

function formatTreeData(data: any[] = [], callBack) {
  return data?.map((item) => {
    const tempItem = callBack(item) ?? item
    return {
      ...tempItem,
      children: isArray(tempItem.children)
        ? formatTreeData(tempItem.children, callBack)
        : [],
    }
  })
}

type MultipleSelectProps = {
  requestFn?: (v?: any) => Promise<any>
  data?: any[]
  labelkey?: string
  valueKey?: string
  searchKey?: string
  isInterface?: boolean
  showItemValue?: boolean
  searchInitValue?: string
} & TreeSelectProps

// 自定义多选组件
export function MultipleSelect(props: MultipleSelectProps) {
  const {
    requestFn,
    data,
    labelkey = 'label',
    valueKey = 'value',
    searchKey = 'name',
    searchInitValue = 'ALL',
    isInterface = false,
    showItemValue = false,
    ...rest
  } = props
  const [option, setOption] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searchValue, setSearchValue] = useState<string>('')

  const [cacheSelectedOption, setCacheSelectedOption] = useState<any[]>([])

  const formatOptionItem = (item) => {
    return {
      ...item,
      label: item[labelkey],
      value: `${item[valueKey]}`,
      title: showItemValue
        ? `${item[labelkey]}（${item[valueKey]}）`
        : item[labelkey],
    }
  }
  const getOptions = async (seearchValue?: string) => {
    try {
      setLoading(true)
      let list = []
      const res = await requestFn?.({
        [searchKey]: seearchValue || searchInitValue,
      })
      if (res?.code === 0) {
        list = formatTreeData(res?.data ?? [], (item) => ({
          ...formatOptionItem(item),
        }))
      }
      setOption(list)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (data?.length) setLoading(false)
  }, [data])

  // 接口获取数据，本地实现过滤
  useEffect(() => {
    if (typeof requestFn === 'function' && !isInterface && !option?.length)
      getOptions()
  }, [requestFn, isInterface])

  useEffect(() => {
    if (data && typeof requestFn !== 'function')
      setOption(
        formatTreeData(data ?? [], (item) => ({
          ...formatOptionItem(item),
        })),
      )
  }, [data])

  // 接口获取数据，远程实现过滤
  const { run: onSearch } = useDebounceFn(
    async (v: string) => {
      if (isInterface && !loading) {
        try {
          setLoading(true)
          const res = await requestFn?.({ [searchKey]: v })
          if (res?.code === 0) {
            const newData = formatTreeData(res.data ?? [], (item) => ({
              ...formatOptionItem(item),
            }))
            const updatedList = uniqBy(
              [...cacheSelectedOption, ...newData],
              valueKey,
            )
            setOption(updatedList)
          }
        } finally {
          setLoading(false)
        }
      }
    },
    {
      wait: 500,
    },
  )
  const onChange = (value) => {
    if (!isInterface) return
    const isValueIncluded = (item: any) => value.includes(item[valueKey])
    const combinedList = [...cacheSelectedOption, ...option].filter(
      isValueIncluded,
    )
    setCacheSelectedOption(uniqBy(combinedList, valueKey))
  }
  const handleSearch = (v: string) => {
    v = v.trim()
    if (v === searchValue) return
    setSearchValue(v)
    onSearch(v)
  }

  return (
    <TreeSelect
      {...(isInterface
        ? {
            filterTreeNode: false,
            notFoundContent: (
              <CustomEmpty isShow description="请输入关键字搜索" />
            ),
          }
        : {
            filterTreeNode: (inputValue, treeNode) => {
              return (
                (treeNode[labelkey] as string)?.includes(inputValue) ||
                treeNode[valueKey] === inputValue
              )
            },
          })}
      maxTagCount="responsive"
      placeholder="请选择"
      popupClassName={classNames(
        'search-form-tree-select',
        isValid(rest.multiple) && !rest.multiple
          ? 'search-form-tree-select-single'
          : '',
      )}
      style={{ width: '100%' }}
      allowClear
      multiple
      showArrow
      showSearch
      treeCheckable
      searchValue={searchValue}
      onSearch={handleSearch}
      treeData={option}
      dropdownRender={(n: ReactNode) => {
        return loading ? (
          <div className="search-form-multiple-select-render">
            <Spin size="small" />
          </div>
        ) : (
          n
        )
      }}
      {...rest}
      onChange={(...arg) => {
        onChange(arg[0])
        rest?.onChange?.(...arg)
      }}
    />
  )
}

export const ShopSelect = (props) => {
  const {
    id,
    name = 'shopNos',
    disabled = false,
    option = [],
    shopFilterOption = [],
    values,
    onChange,
  } = props
  const [loading, setLoading] = useState<boolean>(true)
  const [selectList, setSelectList] = useState<string[]>([])
  const [keyword, setKeyword] = useState<string>('')
  const [shopNos, setShopNos] = useState<any[]>([])
  const keywordRef = useRef<any>(null)
  const isInput = useRef<boolean>(false)
  const shopData = useMemo(() => {
    // const businessList: any = []
    // const statusList: any = []
    // selectList.forEach((it: any) => {
    //   if (['1', '2', '3', '4'].includes(it)) statusList.push(it)
    //   if (['Y', 'N'].includes(it)) {
    //     businessList.push(...(it === 'N' ? ['1', 'C', 'N'] : [it]))
    //   }
    // })
    const list =
      option?.filter((it: any) => {
        return (
          (it.shopName?.includes?.(keyword) || it.shopJdeNo === keyword) &&
          (!selectList.length ||
            selectList.includes(it.storeStatus) ||
            selectList.includes(it.businessModel))
        )
      }) || []
    return list.map((item) => {
      return {
        ...item,
        shopName: item.title,
      }
    })
  }, [option, keyword, selectList])
  const statusOption = useMemo(() => {
    return shopFilterOption?.length
      ? shopFilterOption?.map?.((it) => ({ label: it.name, value: it.code }))
      : [
          { label: '直营', value: 'Y' },
          { label: '合伙', value: 'HH' },
          { label: '筹建中', value: '1' },
          { label: '运营中', value: '2' },
          { label: '即将关店', value: '3' },
          { label: '已关店', value: '4' },
        ]
  }, [shopFilterOption])

  useEffect(() => {
    let num = 10
    let dom = document.querySelector(
      `#${id} .ant-select-selector .ant-select-selection-search input`,
    )
    const timer = setInterval(() => {
      if (dom) {
        clearInterval(timer)
        dom?.addEventListener('keydown', keydownFn)
      } else if (num > 20) {
        clearInterval(timer)
      } else {
        dom = document.querySelector(
          `#${id} .ant-select-selector .ant-select-selection-search input`,
        )
        num += 1
      }
    }, 100)
    return () => {
      if (dom) dom?.removeEventListener('keydown', keydownFn)
      if (timer) clearInterval(timer)
    }
  }, [])

  useEffect(() => {
    if (option?.length) setLoading(false)
  }, [option])

  useEffect(() => {
    setShopNos(values?.[name] || [])
  }, [name, values])

  function keydownFn(e: any) {
    if (e.key === 'Backspace' || e.keycode === 8) {
      isInput.current = true
      setTimeout(() => {
        isInput.current = false
      }, 100)
    }
  }

  const selectChange = (v: any[]) => {
    setSelectList(v)
  }

  const keywordChange = (e: any) => {
    const v = e?.target?.value
    setKeyword(v)
    e.stopPropagation()
    e.preventDefault()
  }

  const keywordFocus = () => {
    isInput.current = true
  }

  const keywordBlur = (e) => {
    isInput.current = false
    e.stopPropagation()
  }

  const keywordOnBlur = () => {
    if (isInput.current) keywordRef?.current?.blur?.()
  }

  const shopChange = (value) => {
    if (isInput.current) return
    setShopNos(value)
    onChange?.({ [name]: value })
  }

  const shopDropdown = (v: boolean) => {
    if (!v) return
    let num = 200
    const timer = setInterval(() => {
      const node = document.querySelector(
        `#${id}-dropdown .ant-spin-nested-loading`,
      )
      if (node) {
        clearInterval(timer)
        setTimeout(() => keywordRef?.current?.focus?.(), 50)
        node.removeEventListener('click', keywordOnBlur)
        node.addEventListener('click', keywordOnBlur)
      } else if (num < 1) {
        clearInterval(timer)
      }
      num -= 1
    }, 100)
  }

  return (
    <div id={id} className="search-item-shop-select">
      <TreeSelect
        maxTagCount="responsive"
        placeholder="请输入门店名称或编码"
        popupClassName="search-item-shop-tree-select"
        style={{ width: '100%' }}
        allowClear
        multiple
        showArrow
        treeCheckable
        labelInValue
        searchValue=""
        placement="bottomLeft"
        fieldNames={{ label: 'shopName', value: 'shopJdeNo' }}
        treeData={shopData}
        disabled={disabled}
        value={shopNos}
        onChange={shopChange}
        onDropdownVisibleChange={shopDropdown}
        treeDefaultExpandAll
        // getPopupContainer={(n) => n.parentNode}
        dropdownRender={(n: ReactNode) => {
          return (
            <div
              id={`${id}-dropdown`}
              className="search-item-shop-tree-select-render"
            >
              <Checkbox.Group
                value={selectList}
                options={statusOption}
                onChange={selectChange}
              />
              <div className="search-item-shop-tree-select-render-input">
                <Input
                  ref={keywordRef}
                  prefix={<Icon component={searchIcon} />}
                  placeholder="可输入门店名、编码"
                  value={keyword}
                  onFocus={keywordFocus}
                  onBlur={keywordBlur}
                  onChange={keywordChange}
                />
              </div>
              <Spin size="small" spinning={loading}>
                {n}
              </Spin>
            </div>
          )
        }}
      />
    </div>
  )
}
